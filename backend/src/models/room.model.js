import { pool } from "../db.js";

/**
 * HOTEL MANAGER
 * Add room (PENDING)
 */
export async function createRoom({
  hotel_id,
  hotel_room_type_id,
  room_number,
  price,
  created_by_user_id,
}) {
  // Check if room number already exists for this hotel
  const [existingRoom] = await pool.query(
    `SELECT hotel_room_details_id FROM hotel_room_details WHERE hotel_id = ? AND room_number = ?`,
    [hotel_id, room_number]
  );

  if (existingRoom.length > 0) {
    console.warn(`⚠️ DUPLICATE ROOM ATTEMPT (room.model.js): room_number=${room_number} already exists for hotel_id=${hotel_id}`);
    throw new Error(`Room number ${room_number} already exists for this hotel`);
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO hotel_room_details
      (
        hotel_id,
        hotel_room_type_id,
        room_number,
        price,
        created_by_user_id,
        approval_status
      )
      VALUES (?, ?, ?, ?, ?, 'PENDING')
      `,
      [
        hotel_id,
        hotel_room_type_id,
        room_number,
        price,
        created_by_user_id,
      ]
    );

    console.log(`✅ ROOM CREATED (room.model.js): room_id=${result.insertId}, room_number=${room_number}, hotel_id=${hotel_id}`);

    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.warn(`⚠️ DATABASE DUPLICATE KEY: room_number=${room_number} for hotel_id=${hotel_id}`);
      throw new Error(`Room number ${room_number} already exists for this hotel`);
    }
    throw error;
  }
}

/**
 * ADMIN
 * Approve / reject room
 */
export async function approveRoom({
  hotel_room_details_id,
  approval_status,
  admin_id,
}) {
  const [result] = await pool.query(
    `
    UPDATE hotel_room_details
    SET
      approval_status = ?,
      approved_by_admin_id = ?
    WHERE hotel_room_details_id = ?
    `,
    [approval_status, admin_id, hotel_room_details_id]
  );

  return result.affectedRows;
}

/**
 * PUBLIC
 * Fetch AVAILABLE approved rooms by hotel
 */
export async function getApprovedRoomsByHotel(hotel_id) {
  const [rows] = await pool.query(
    `
    SELECT DISTINCT
      hrd.hotel_room_details_id,
      hrd.room_number,
      hrd.price,
      hrt.name AS room_type
    FROM hotel_room_details hrd
    JOIN hotel_room_type hrt
      ON hrd.hotel_room_type_id = hrt.hotel_room_type_id
    LEFT JOIN (
      SELECT DISTINCT hrb.hotel_room_details_id
      FROM hotel_room_booking hrb
      JOIN booking b ON hrb.booking_id = b.booking_id
      WHERE b.status = 'CONFIRMED'
        AND CURDATE() >= b.checkin_date
        AND CURDATE() <= b.checkout_date
    ) current_bookings
      ON hrd.hotel_room_details_id = current_bookings.hotel_room_details_id
    WHERE hrd.hotel_id = ?
      AND hrd.approval_status = 'APPROVED'
      AND current_bookings.hotel_room_details_id IS NULL
    ORDER BY hrd.room_number ASC
    `,
    [hotel_id]
  );

  return rows;
}
