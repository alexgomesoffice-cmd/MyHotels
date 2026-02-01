import { pool } from "../db.js";
import { getHotelImagesByHotelId } from "../models/hotelImage.model.js";

/*
  HERO SEARCH:
  - location -> hotel.address
  - checkIn / checkOut OR checkin_date / checkout_date
  - rooms -> minimum available rooms
*/
export const searchAvailableHotels = async (req, res) => {
  try {
    console.log("HERO SEARCH BACKEND BODY:", req.body);

    const {
      location,
      checkIn,
      checkOut,
      checkin_date,
      checkout_date,
      rooms,
    } = req.body;

    const finalCheckIn = checkIn || checkin_date;
    const finalCheckOut = checkOut || checkout_date;
    const roomsCount = parseInt(rooms, 10);

    if (
      typeof location !== "string" ||
      location.trim() === "" ||
      typeof finalCheckIn !== "string" ||
      typeof finalCheckOut !== "string" ||
      !Number.isInteger(roomsCount) ||
      roomsCount < 1
    ) {
      return res.status(400).json({
        message:
          "location, checkIn/checkin_date, checkOut/checkout_date and rooms (integer >= 1) are required",
      });
    }

    const checkInDate = new Date(finalCheckIn);
    const checkOutDate = new Date(finalCheckOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({
        message: "Invalid check-in or check-out date",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "checkOut date must be after checkIn date",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        h.hotel_id,
        h.name AS hotel_name,
        h.address,
        h.description,
        MIN(hrd.price) AS starting_price,
        COUNT(DISTINCT hrd.hotel_room_details_id) AS available_rooms
      FROM hotel h
      JOIN hotel_room_details hrd
        ON h.hotel_id = hrd.hotel_id
        AND hrd.approval_status = 'APPROVED'

      LEFT JOIN (
        SELECT DISTINCT hrb.hotel_room_details_id
        FROM hotel_room_booking hrb
        JOIN booking b ON hrb.booking_id = b.booking_id
        WHERE b.status = 'CONFIRMED'
          AND b.checkin_date < ?
          AND b.checkout_date > ?
      ) booked_rooms
        ON hrd.hotel_room_details_id = booked_rooms.hotel_room_details_id

      WHERE h.approval_status = 'APPROVED'
        AND h.address LIKE ?
        AND booked_rooms.hotel_room_details_id IS NULL

      GROUP BY h.hotel_id
      HAVING available_rooms >= ?
      ORDER BY h.created_at DESC
      `,
      [finalCheckOut, finalCheckIn, `%${location}%`, roomsCount]
    );

    // Fetch images for each hotel
    for (const hotel of rows) {
      const images = await getHotelImagesByHotelId(hotel.hotel_id);
      hotel.image = images.length > 0 ? images[0].image_url : null;
    }

    res.json(rows);
  } catch (error) {
    console.error("SEARCH AVAILABLE HOTELS ERROR:", error);
    res.status(500).json({
      message: "Failed to search hotels",
    });
  }
};
