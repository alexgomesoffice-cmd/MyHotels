import { pool } from "../db.js";

/**
 * PUBLIC
 * Fetch hotel images ONLY if hotel is approved
 */
export async function getHotelImagesByHotelId(hotel_id) {
  const [rows] = await pool.query(
    `
    SELECT
      hi.hotel_image_id,
      hi.image_url,
      hi.image_public_id
    FROM hotel_images hi
    JOIN hotel h
      ON hi.hotel_id = h.hotel_id
    WHERE hi.hotel_id = ?
      AND h.approval_status = 'APPROVED'
    ORDER BY hi.created_at ASC
    `,
    [hotel_id]
  );

  return rows;
}
