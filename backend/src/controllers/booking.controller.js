// backend/src/controllers/booking.controller.js
import {
  createBooking,
  cancelBooking,
  getBookingsByUser,
  getBookingsByHotelManager,
  getAllBookings,
  isRoomAvailable,
} from "../models/booking.model.js";

import { pool } from "../db.js";

/* ================= USER > CREATE BOOKING ================= */
export const addBooking = async (req, res) => {
  try {
    console.log("🔵 BOOKING REQUEST RECEIVED:");
    console.log("   Body:", req.body);
    console.log("   User:", req.user);

    const {
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
      total_price,
    } = req.body;
    
    console.log("🔵 BOOKING DATA: room_id=", hotel_room_details_id, "checkin=", checkin_date, "checkout=", checkout_date, "for_room=", for_room);

    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (
      !hotel_room_details_id ||
      !checkin_date ||
      !checkout_date ||
      !for_room ||
      !total_price
    ) {
      return res.status(400).json({ message: "Missing required booking fields" });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(checkin_date) || !dateRegex.test(checkout_date)) {
      return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD format" });
    }

    // Validate dates are valid dates
    const checkinDate = new Date(checkin_date);
    const checkoutDate = new Date(checkout_date);
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      return res.status(400).json({ message: "Invalid date values" });
    }

    // FIXED #9: Validate checkout is after checkin AND checkin is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkinDate < today) {
      return res.status(400).json({ message: "Check-in date cannot be in the past" });
    }

    if (checkoutDate <= checkinDate) {
      return res.status(400).json({ message: "Checkout date must be after checkin date" });
    }

    // Validate total_price is greater than 0
    if (Number(total_price) <= 0) {
      return res.status(400).json({ message: "Total price must be greater than 0" });
    }

    // FIXED #11: Validate user_details uniqueness - should only have ONE record
    const [userDetailsRecords] = await pool.query(
      `
      SELECT user_details_id
      FROM user_details
      WHERE user_id = ?
      `,
      [user_id]
    );

    if (userDetailsRecords.length === 0) {
      return res.status(404).json({
        message: "Please enter your details to book your room",
      });
    }

    if (userDetailsRecords.length > 1) {
      return res.status(500).json({
        message: "Data integrity error. Multiple user details records found. Please contact support.",
      });
    }

    const user_details_id = userDetailsRecords[0].user_details_id;

    // Check room availability
    const available = await isRoomAvailable({
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
    });

    if (!available) {
      return res.status(409).json({
        message: "Rooms not available for selected dates",
      });
    }

    // Create booking (model expects an object)
    const bookingId = await createBooking({
      user_details_id,
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
      total_price,
    });

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking_id: bookingId,
    });
  } catch (error) {
    console.error("ADD BOOKING ERROR FULL:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

/* ================= USER > CANCEL OWN BOOKING ================= */
export const userCancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const user_id = req.user?.user_id;

    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
    }

    if (!user_id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get booking details to check checkin date and verify ownership
    const [[booking]] = await pool.query(
      `
      SELECT b.booking_id, b.checkin_date, b.status
      FROM booking b
      JOIN user_details ud ON b.user_details_id = ud.user_details_id
      WHERE b.booking_id = ? AND ud.user_id = ?
      `,
      [booking_id, user_id]
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== 'CONFIRMED') {
      return res.status(400).json({ message: "Only confirmed bookings can be cancelled" });
    }

    // Check if cancellation is allowed (2 days before checkin)
    const checkinDate = new Date(booking.checkin_date);
    const currentDate = new Date();
    const daysUntilCheckin = Math.floor((checkinDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysUntilCheckin < 2) {
      return res.status(400).json({ 
        message: `Bookings can only be cancelled 2 days before check-in. Your check-in is in ${daysUntilCheckin} days.` 
      });
    }

    const cancelled = await cancelBooking({ booking_id });
    if (!cancelled) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

/* ================= USER > VIEW OWN BOOKINGS ================= */
export const fetchMyBookings = async (req, res) => {
  try {
    const user_id = req.user?.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const bookings = await getBookingsByUser(user_id);
    res.json(bookings);
  } catch (error) {
    console.error("FETCH USER BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

/* ================= HOTEL MANAGER > VIEW BOOKINGS ================= */
export const fetchHotelBookings = async (req, res) => {
  try {
    const { manager_id } = req.params;
    const bookings = await getBookingsByHotelManager(manager_id);
    res.json(bookings);
  } catch (error) {
    console.error("FETCH HOTEL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotel bookings" });
  }
};

/* ================= ADMIN > VIEW ALL BOOKINGS ================= */
export const fetchAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("FETCH ALL BOOKINGS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch all bookings" });
  }
};

/* ================= CHECK AVAILABILITY ================= */
export const checkRoomAvailability = async (req, res) => {
  try {
    const {
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
    } = req.body;

    if (
      !hotel_room_details_id ||
      !checkin_date ||
      !checkout_date ||
      !for_room
    ) {
      return res.status(400).json({
        message:
          "hotel_room_details_id, checkin_date, checkout_date and for_room are required",
      });
    }

    const available = await isRoomAvailable({
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
    });

    res.json({ available });
  } catch (error) {
    console.error("CHECK AVAILABILITY ERROR:", error);
    res.status(500).json({ message: "Failed to check availability" });
  }
};

/*booking histoy*/


export const getUserBookingHistory = async (req, res) => {
  console.log(" ENTER getUserBookingHistory");
  console.log(" REQ.USER:", req.user);

  try {
    const userId = req.user.user_id;
    console.log(" USER ID:", userId);
    console.log(" RUNNING QUERY...");

    const [rows] = await pool.query(
      `
      SELECT DISTINCT
        b.booking_id,
        b.checkin_date,
        b.checkout_date,
        b.for_room AS rooms_booked,
        b.total_price,
        b.status,
        b.created_at,
        h.hotel_id,
        h.name AS hotel_name,
        h.address AS hotel_address
      FROM booking b
      JOIN user_details ud
        ON b.user_details_id = ud.user_details_id
      JOIN hotel_room_booking hrb
        ON b.booking_id = hrb.booking_id
      JOIN hotel_room_details hrd
        ON hrb.hotel_room_details_id = hrd.hotel_room_details_id
      JOIN hotel h
        ON hrd.hotel_id = h.hotel_id
      WHERE ud.user_id = ?
      ORDER BY b.created_at DESC
      `,
      [userId]
    );

    console.log(" QUERY FINISHED");
    console.log(" ROWS:", rows);
    console.log(" SENDING RESPONSE");

    return res.status(200).json(rows);
  } catch (error) {
    console.error(" BOOKING HISTORY ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch booking history",
    });
  }
};

/*user cancel booking (un used, i wont be using for now)*/
export const cancelUserBooking = async (req, res) => {
  try {
    console.log(" ENTER cancelUserBooking");

    const userId = req.user.user_id;
    const { bookingId } = req.params;

    // Verify booking belongs to user and is cancellable
    const [rows] = await db.query(
      `
      SELECT b.booking_id
      FROM booking b
      JOIN user_details ud ON b.user_details_id = ud.user_details_id
      WHERE b.booking_id = ?
        AND ud.user_id = ?
        AND b.status = 'CONFIRMED'
      `,
      [bookingId, userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Booking cannot be cancelled",
      });
    }

    //  Cancel booking
    await db.query(
      `
      UPDATE booking
      SET status = 'CANCELLED'
      WHERE booking_id = ?
      `,
      [bookingId]
    );

    //  RELEASE ROOMS 
    await db.query(
      `
      DELETE FROM hotel_room_booking
      WHERE booking_id = ?
      `,
      [bookingId]
    );

    console.log("BOOKING CANCELLED & ROOMS RELEASED:", bookingId);

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error(" CANCEL BOOKING ERROR:", error);
    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
};
