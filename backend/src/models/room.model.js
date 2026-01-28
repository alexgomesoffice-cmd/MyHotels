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
    throw new Error(`Room number ${room_number} already exists for this hotel`);
  }

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

  return result.insertId;
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
    SELECT
      hrd.hotel_room_details_id,
      hrd.room_number,
      hrd.price,
      hrt.name AS room_type
    FROM hotel_room_details hrd
    JOIN hotel_room_type hrt
      ON hrd.hotel_room_type_id = hrt.hotel_room_type_id
    LEFT JOIN hotel_room_booking hrb
      ON hrd.hotel_room_details_id = hrb.hotel_room_details_id
    LEFT JOIN booking b
      ON hrb.booking_id = b.booking_id
      AND b.status = 'CONFIRMED'
      AND CURDATE() >= b.checkin_date
      AND CURDATE() <= b.checkout_date
    WHERE hrd.hotel_id = ?
      AND hrd.approval_status = 'APPROVED'
      AND b.booking_id IS NULL
    ORDER BY hrd.room_number ASC
    `,
    [hotel_id]
  );

  return rows;
}
