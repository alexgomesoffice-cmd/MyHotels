import { pool } from "../db.js";

// PUBLIC: fetch all room types
export const getAllRoomTypes = async () => {
  const [rows] = await pool.query(`
    SELECT 
      hotel_room_type_id,
      name
    FROM hotel_room_type
    ORDER BY name
  `);

  return rows;
};
