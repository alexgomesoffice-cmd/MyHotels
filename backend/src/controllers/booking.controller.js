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
    console.log("🔹 BOOKING BODY:", req.body);
    console.log("🔹 USER FROM JWT:", req.user);

    const {
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_room,
      total_price,
    } = req.body;

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

    // Resolve user_details_id
    const [[userDetails]] = await pool.query(
      `
      SELECT user_details_id
      FROM user_details
      WHERE user_id = ?
      `,
      [user_id]
    );

    if (!userDetails) {
      return res.status(404).json({
        message: "User details not found",
      });
    }

    const user_details_id = userDetails.user_details_id;

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
    console.error("❌ ADD BOOKING ERROR FULL:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};

/* ================= USER > CANCEL OWN BOOKING ================= */
export const userCancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    if (!booking_id) {
      return res.status(400).json({ message: "booking_id is required" });
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
