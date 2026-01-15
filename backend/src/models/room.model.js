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
 * Fetch approved rooms by hotel
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
    WHERE hrd.hotel_id = ?
      AND hrd.approval_status = 'APPROVED'
    ORDER BY hrd.room_number ASC
    `,
    [hotel_id]
  );

  return rows;
}
