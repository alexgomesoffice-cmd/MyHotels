import { pool } from "../db.js";

/**
 * PUBLIC
 * Fetch room images ONLY if:
 * - room is APPROVED
 * - hotel is APPROVED
 */
export async function getRoomImagesByRoomId(hotel_room_details_id) {
  const [rows] = await pool.query(
    `
    SELECT
      ri.room_image_id,
      ri.image_url,
      ri.image_public_id
    FROM hotel_room_images ri
    JOIN hotel_room_details r
      ON ri.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h
      ON r.hotel_id = h.hotel_id
    WHERE ri.hotel_room_details_id = ?
      AND r.approval_status = 'APPROVED'
      AND h.approval_status = 'APPROVED'
    ORDER BY ri.created_at ASC
    `,
    [hotel_room_details_id]
  );

  return rows;
}
