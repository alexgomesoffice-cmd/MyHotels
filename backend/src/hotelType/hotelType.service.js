import { pool } from "../db.js";

export const getHotelTypes = async () => {
  const [rows] = await pool.query(
    "SELECT hotel_type_id, name FROM hotel_type ORDER BY name"
  );
  return rows;
};
