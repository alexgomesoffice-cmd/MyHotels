// backend/src/models/booking.model.js
import { pool } from "../db.js";

/* ================= CREATE BOOKING (AUTO CONFIRMED) =================*/
export async function createBooking({
  user_details_id,
  hotel_room_details_id,
  checkin_date,
  checkout_date,
  for_room,
  total_price,
}) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1) get hotel_id and room_type for provided hotel_room_details_id
    const [[roomInfo]] = await connection.query(
      `
      SELECT hotel_id, hotel_room_type_id, approval_status
      FROM hotel_room_details
      WHERE hotel_room_details_id = ?
      `,
      [hotel_room_details_id]
    );

    if (!roomInfo) {
      console.error(`❌ BOOKING ERROR: Room not found for hotel_room_details_id=${hotel_room_details_id}`);
      throw new Error("Requested room not found");
    }

    if (roomInfo.approval_status && roomInfo.approval_status !== "APPROVED") {
      throw new Error("Requested room is not approved");
    }

    const hotelId = roomInfo.hotel_id;
    const hotelRoomTypeId = roomInfo.hotel_room_type_id;

    // 2) total physical rooms for that hotel & room-type (approved ones)
    const [[roomCountRow]] = await connection.query(
      `
      SELECT COUNT(*) AS total_rooms
      FROM hotel_room_details
      WHERE hotel_id = ?
        AND hotel_room_type_id = ?
        AND (approval_status IS NULL OR approval_status = 'APPROVED')
      `,
      [hotelId, hotelRoomTypeId]
    );
    const totalRooms = Number(roomCountRow?.total_rooms ?? 0);

    if (totalRooms <= 0) {
      throw new Error("No rooms of the requested type available in this hotel");
    }

    // 3) count already booked rooms for overlapping confirmed bookings
    // Overlap occurs when: existing_checkin < new_checkout AND existing_checkout >= new_checkin
    const [[bookedRow]] = await connection.query(
      `
      SELECT COALESCE(SUM(b.for_room), 0) AS booked_rooms
      FROM booking b
      JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
      JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
      WHERE r.hotel_id = ?
        AND r.hotel_room_type_id = ?
        AND b.status = 'CONFIRMED'
        AND b.checkin_date < ?
        AND b.checkout_date >= ?
      `,
      [hotelId, hotelRoomTypeId, checkout_date, checkin_date]
    );
    const bookedRooms = Number(bookedRow?.booked_rooms ?? 0);

    const availableRooms = totalRooms - bookedRooms;
    if (availableRooms < for_room) {
      throw new Error(`Only ${availableRooms} room(s) available for selected dates`);
    }

    // 4) insert booking row
    const [bookingResult] = await connection.query(
      `
      INSERT INTO booking
        (user_details_id, checkin_date, checkout_date, for_room, total_price, status)
      VALUES (?, ?, ?, ?, ?, 'CONFIRMED')
      `,
      [user_details_id, checkin_date, checkout_date, for_room, total_price]
    );
    const booking_id = bookingResult.insertId;

    // 5) select specific available room ids to link to booking
    const [availableRoomsRows] = await connection.query(
      `
      SELECT r.hotel_room_details_id
      FROM hotel_room_details r
      LEFT JOIN hotel_room_booking hrb ON r.hotel_room_details_id = hrb.hotel_room_details_id
      LEFT JOIN booking b ON hrb.booking_id = b.booking_id AND b.status = 'CONFIRMED'
      WHERE r.hotel_id = ?
        AND r.hotel_room_type_id = ?
        AND (r.approval_status IS NULL OR r.approval_status = 'APPROVED')
      GROUP BY r.hotel_room_details_id
      HAVING SUM(
        CASE
          WHEN b.booking_id IS NULL THEN 0
          WHEN (b.checkin_date < ? AND b.checkout_date >= ?) THEN 1
          ELSE 0
        END
      ) = 0
      LIMIT ?
      `,
      [hotelId, hotelRoomTypeId, checkin_date, checkout_date, for_room]
    );

    if (!availableRoomsRows || availableRoomsRows.length < for_room) {
      console.error(`❌ BOOKING ERROR: Insufficient rooms. Found: ${availableRoomsRows?.length || 0}, Required: ${for_room}`);
      console.error(`   hotelId=${hotelId}, roomTypeId=${hotelRoomTypeId}, checkin=${checkin_date}, checkout=${checkout_date}`);
      throw new Error("Unable to reserve specific rooms — please try again");
    }

    console.log(`✅ BOOKING CREATION: Booked ${availableRoomsRows.length} room(s) for booking_id=${booking_id}`);

    // 6) link each selected room to booking
    const insertPromises = availableRoomsRows.map((r) =>
      connection.query(
        `
        INSERT INTO hotel_room_booking
          (booking_id, hotel_room_details_id)
        VALUES (?, ?)
        `,
        [booking_id, r.hotel_room_details_id]
      )
    );
    await Promise.all(insertPromises);

    console.log(`✅ BOOKING LINKED: booking_id=${booking_id} linked to ${availableRoomsRows.length} rooms`);

    await connection.commit();
    return booking_id;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/* ================= CANCEL BOOKING ================= */
export async function cancelBooking({ booking_id }) {
  const [result] = await pool.query(
    `
    UPDATE booking
    SET status = 'CANCELLED'
    WHERE booking_id = ?
    `,
    [booking_id]
  );

  return result.affectedRows;
}

/* ================= USER > VIEW OWN BOOKINGS ================= */
export async function getBookingsByUser(user_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      h.name AS hotel_name,
      r.room_number,
      r.price AS room_price
    FROM booking b
    JOIN user_details ud ON b.user_details_id = ud.user_details_id
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE ud.user_id = ?
    ORDER BY b.created_at DESC
    `,
    [user_id]
  );

  return rows;
}

/* ================= HOTEL MANAGER > VIEW BOOKINGS ================= */
export async function getBookingsByHotelManager(manager_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      h.name AS hotel_name,
      r.room_number
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ?
    ORDER BY b.created_at DESC
    `,
    [manager_id]
  );

  return rows;
}

/* ================= ADMIN > VIEW ALL BOOKINGS ================= */
export async function getAllBookings() {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      u.name AS user_name,
      h.name AS hotel_name
    FROM booking b
    JOIN user_details ud ON b.user_details_id = ud.user_details_id
    JOIN user u ON ud.user_id = u.user_id
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    ORDER BY b.created_at DESC
    `
  );

  return rows;
}

/* ================= CHECK ROOM AVAILABILITY ================= */
export const isRoomAvailable = async ({
  hotel_room_details_id,
  checkin_date,
  checkout_date,
  for_room,
}) => {
  const [[roomInfo]] = await pool.query(
    `
    SELECT hotel_id, hotel_room_type_id
    FROM hotel_room_details
    WHERE hotel_room_details_id = ?
    `,
    [hotel_room_details_id]
  );

  if (!roomInfo) return false;

  const hotelId = roomInfo.hotel_id;
  const hotelRoomTypeId = roomInfo.hotel_room_type_id;

  const [[roomCountRow]] = await pool.query(
    `
    SELECT COUNT(*) AS total_rooms
    FROM hotel_room_details
    WHERE hotel_id = ?
      AND hotel_room_type_id = ?
      AND (approval_status IS NULL OR approval_status = 'APPROVED')
    `,
    [hotelId, hotelRoomTypeId]
  );
  const totalRooms = Number(roomCountRow?.total_rooms ?? 0);

  const [[bookedRow]] = await pool.query(
    `
    SELECT COALESCE(SUM(b.for_room), 0) AS booked_rooms
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    WHERE r.hotel_id = ?
      AND r.hotel_room_type_id = ?
      AND b.status = 'CONFIRMED'
      AND b.checkin_date < ?
      AND b.checkout_date >= ?
    `,
    [hotelId, hotelRoomTypeId, checkout_date, checkin_date]
  );

  const bookedRooms = Number(bookedRow?.booked_rooms ?? 0);

  return (totalRooms - bookedRooms) >= for_room;
};

// FIXED #8: Helper function to safely get user_id from booking
// This addresses the issue of booking model missing direct user_id reference
export async function getUserIdFromBooking(booking_id) {
  const [[result]] = await pool.query(
    `SELECT u.user_id
     FROM booking b
     JOIN user_details ud ON b.user_details_id = ud.user_details_id
     JOIN user u ON ud.user_id = u.user_id
     WHERE b.booking_id = ?`,
    [booking_id]
  );
  
  return result ? result.user_id : null;
}

// Helper function to verify booking ownership with proper user_details handling
export async function verifyBookingOwnership(booking_id, user_id) {
  const [[result]] = await pool.query(
    `SELECT b.booking_id
     FROM booking b
     JOIN user_details ud ON b.user_details_id = ud.user_details_id
     WHERE b.booking_id = ?
     AND ud.user_id = ?
     AND (SELECT COUNT(*) FROM user_details WHERE user_id = ?) = 1`,
    [booking_id, user_id, user_id]
  );
  
  return result ? true : false;
}
