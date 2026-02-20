import { pool } from "../db.js";

/* ================= HOTEL MANAGER > ADD HOTEL ================= */
export async function createHotel({
  name,
  address,
  description,
  hotel_type_id,
  created_by_user_id,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO hotel
      (name, address, description, hotel_type_id, created_by_user_id, approval_status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
    `,
    [name, address, description, hotel_type_id, created_by_user_id]
  );

  return result.insertId;
}

/* ================= PUBLIC > FETCH APPROVED HOTELS ================= */
export async function getAllApprovedHotels() {
  const [rows] = await pool.query(`
    SELECT 
  h.hotel_id,
  h.name,
  h.address,
  h.description,
  ht.name AS hotel_type,
  COALESCE(MIN(hrd.price), 0) AS price_per_night,
  MIN(hi.image_url) AS image
FROM hotel h
JOIN hotel_type ht
  ON h.hotel_type_id = ht.hotel_type_id
LEFT JOIN hotel_room_details hrd
  ON h.hotel_id = hrd.hotel_id
  AND hrd.approval_status = 'APPROVED'
LEFT JOIN hotel_images hi
  ON h.hotel_id = hi.hotel_id
WHERE h.approval_status = 'APPROVED'
GROUP BY h.hotel_id
ORDER BY h.created_at DESC;

  `);

  return rows;
}

/* ================= FETCH SINGLE HOTEL ================= */
export async function getHotelById(hotel_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      h.hotel_id,
      h.name,
      h.address,
      h.description,
      ht.name AS hotel_type,
      h.approval_status
    FROM hotel h
    JOIN hotel_type ht 
      ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.hotel_id = ?
    `,
    [hotel_id]
  );

  return rows[0];
}

/* ================= ADMIN > APPROVE / REJECT ================= */
export async function approveHotel({ hotel_id, approval_status, admin_id }) {
  const [result] = await pool.query(
    `
    UPDATE hotel
    SET approval_status = ?, approved_by_admin_id = ?
    WHERE hotel_id = ?
    `,
    [approval_status, admin_id, hotel_id]
  );

  return result.affectedRows;
}

/* ================= ADMIN > FETCH PENDING ================= */
export async function getPendingHotels() {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      h.description,
      ht.name AS hotel_type,
      h.created_by_user_id,
      h.created_at
    FROM hotel h
    JOIN hotel_type ht 
      ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'PENDING'
    ORDER BY h.created_at DESC
  `);

  return rows;
}

/* ================= MANAGER > OWN HOTELS ================= */
export async function getHotelsByManager(user_id) {
  const [rows] = await pool.query(
    `
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      h.description,
      ht.name AS hotel_type,
      h.approval_status,
      h.created_at
    FROM hotel h
    JOIN hotel_type ht 
      ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.created_by_user_id = ?
    ORDER BY h.created_at DESC
    `,
    [user_id]
  );

  return rows;
}
