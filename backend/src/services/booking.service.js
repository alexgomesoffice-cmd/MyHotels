import { pool } from "../db.js";

/* ================= FETCH APPROVED HOTELS ================= */

export const getApprovedHotels = async () => {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type
    FROM hotel h
    JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'APPROVED'
    ORDER BY h.created_at DESC
  `);

  return rows;
};

/* ================= FETCH ROOMS BY HOTEL ================= */

export const getApprovedRoomsByHotel = async (hotelId) => {
  const [rows] = await pool.query(`
    SELECT
      hotel_room_details_id,
      room_number,
      price
    FROM hotel_room_details
    WHERE hotel_id = ?
      AND approval_status = 'APPROVED'
  `, [hotelId]);

  return rows;
};

/* ================= CHECK ROOM AVAILABILITY ================= */

export const isRoomAvailable = async (roomId, checkIn, checkOut) => {
  const [rows] = await pool.query(`
    SELECT 1
    FROM booking b
    JOIN hotel_room_booking hrb
      ON b.booking_id = hrb.booking_id
    WHERE hrb.hotel_room_details_id = ?
      AND NOT (
        b.check_out <= ?
        OR b.check_in >= ?
      )
  `, [roomId, checkIn, checkOut]);

  return rows.length === 0;
};

/* ================= CREATE BOOKING ================= */

export const createBooking = async (
  userId,
  roomId,
  checkIn,
  checkOut,
  totalPrice
) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [bookingResult] = await conn.query(`
      INSERT INTO booking (user_id, check_in, check_out, total_price)
      VALUES (?, ?, ?, ?)
    `, [userId, checkIn, checkOut, totalPrice]);

    const bookingId = bookingResult.insertId;

    await conn.query(`
      INSERT INTO hotel_room_booking (booking_id, hotel_room_details_id)
      VALUES (?, ?)
    `, [bookingId, roomId]);

    await conn.commit();
    return bookingId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/* ================= USER BOOKINGS ================= */

export const getUserBookings = async (userId) => {
  const [rows] = await pool.query(`
    SELECT
      b.booking_id,
      b.check_in,
      b.check_out,
      b.total_price,
      h.name AS hotel_name,
      r.room_number
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `, [userId]);

  return rows;
};
