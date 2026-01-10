import { pool } from "../db.js";

// Hotel Manager adds room (PENDING)
export async function createRoom({
  hotel_id,
  hotel_room_type_id,
  room_number,
  price,
  created_by_user_id,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO HOTEL_ROOM_DETAILS
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

// ADMIN > APPROVE / REJECT ROOM
export async function approveRoom({
  hotel_room_details_id,
  approval_status,
  admin_id,
}) {
  const [result] = await pool.query(
    `
    UPDATE HOTEL_ROOM_DETAILS
    SET
      approval_status = ?,
      approved_by_admin_id = ?
    WHERE hotel_room_details_id = ?
    `,
    [approval_status, admin_id, hotel_room_details_id]
  );

  return result.affectedRows;
}


// FETCH APPROVED ROOMS BY HOTEL (PUBLIC)
export async function getApprovedRoomsByHotel(hotel_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      r.hotel_room_details_id,
      r.room_number,
      r.price,
      rt.name AS room_type
    FROM HOTEL_ROOM_DETAILS r
    JOIN HOTEL_ROOM_TYPE rt 
      ON r.hotel_room_type_id = rt.hotel_room_type_id
    WHERE r.hotel_id = ?
      AND r.approval_status = 'APPROVED'
    `,
    [hotel_id]
  );

  return rows;
}