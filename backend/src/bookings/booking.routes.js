import * as bookingService from "./booking.service.js";

/* ================= HOTELS ================= */

export const getHotels = async (req, res) => {
  try {
    const hotels = await bookingService.getApprovedHotels();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: "Failed to load hotels" });
  }
};

/* ================= ROOMS ================= */

export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rooms = await bookingService.getApprovedRoomsByHotel(hotelId);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Failed to load rooms" });
  }
};

/* ================= CREATE BOOKING ================= */

export const bookRoom = async (req, res) => {
  const { room_id, check_in, check_out, total_price } = req.body;

  try {
    const available = await bookingService.isRoomAvailable(
      room_id,
      check_in,
      check_out
    );

    if (!available) {
      return res.status(400).json({ message: "Room is already booked" });
    }

    const bookingId = await bookingService.createBooking(
      req.user.user_id,
      room_id,
      check_in,
      check_out,
      total_price
    );

    res.json({ message: "Booking successful", booking_id: bookingId });
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
};

/* ================= USER BOOKINGS ================= */

export const myBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.user_id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to load bookings" });
  }
};
