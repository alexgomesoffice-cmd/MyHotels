import {
  createBooking,
  cancelBooking,
  getBookingsByUser,
  getBookingsByHotelManager,
  getAllBookings,
  isRoomAvailable,
} from "../models/booking.model.js";

//USER > CREATE BOOKING
export const addBooking = async (req, res) => {
  try {
    const {
      user_details_id,
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_persons,
      total_price,
    } = req.body;

    if (
      !user_details_id ||
      !hotel_room_details_id ||
      !checkin_date ||
      !checkout_date ||
      !for_persons ||
      !total_price
    ) {
      return res.status(400).json({
        message: "All booking fields are required",
      });
    }

    // CHECK ROOM AVAILABILITY 
    const available = await isRoomAvailable(
      hotel_room_details_id,
      checkin_date,
      checkout_date
    );

    if (!available) {
      return res.status(409).json({
        message: "Room is not available for selected dates",
      });
    }

    const bookingId = await createBooking({
      user_details_id,
      hotel_room_details_id,
      checkin_date,
      checkout_date,
      for_persons,
      total_price,
    });

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking_id: bookingId,
    });
  } catch (error) {
    console.error("ADD BOOKING ERROR:", error);
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

//USER > CANCEL OWN BOOKING
export const userCancelBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    if (!booking_id) {
      return res.status(400).json({
        message: "booking_id is required",
      });
    }

    const cancelled = await cancelBooking({ booking_id });

    if (!cancelled) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

//USER > VIEW OWN BOOKINGS
export const fetchMyBookings = async (req, res) => {
  try {
    const { user_id } = req.params;

    const bookings = await getBookingsByUser(user_id);

    res.json(bookings);
  } catch (error) {
    console.error("FETCH USER BOOKINGS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

//HOTEL MANAGER > VIEW
// BOOKINGS FOR OWN HOTELS
export const fetchHotelBookings = async (req, res) => {
  try {
    const { manager_id } = req.params;

    const bookings = await getBookingsByHotelManager(manager_id);

    res.json(bookings);
  } catch (error) {
    console.error("FETCH HOTEL BOOKINGS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch hotel bookings",
      error: error.message,
    });
  }
};

//ADMIN > VIEW ALL BOOKINGS
export const fetchAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("FETCH ALL BOOKINGS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch all bookings",
      error: error.message,
    });
  }
};

//USER > CHECK ROOM AVAILABILITY
export const checkRoomAvailability = async (req, res) => {
  try {
    const {
      hotel_room_details_id,
      checkin_date,
      checkout_date,
    } = req.body;

    if (!hotel_room_details_id || !checkin_date || !checkout_date) {
      return res.status(400).json({
        message:
          "hotel_room_details_id, checkin_date and checkout_date are required",
      });
    }

    const available = await isRoomAvailable(
      hotel_room_details_id,
      checkin_date,
      checkout_date
    );

    if (!available) {
      return res.json({
        available: false,
        message: "Room is already booked for selected dates",
      });
    }

    res.json({ available: true });
  } catch (error) {
    console.error("CHECK AVAILABILITY ERROR:", error);
    res.status(500).json({
      message: "Failed to check availability",
      error: error.message,
    });
  }
};
