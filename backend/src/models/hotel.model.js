import { pool } from "../db.js";

//HOTEL MANAGER > ADD HOTEL
export async function createHotel({
  name,
  address,
  hotel_type_id,
  created_by_user_id,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO HOTEL
    (name, address, hotel_type_id, created_by_user_id, approval_status)
    VALUES (?, ?, ?, ?, 'PENDING')
    `,
    [name, address, hotel_type_id, created_by_user_id]
  );

  return result.insertId;
}

 //PUBLIC > FETCH APPROVED HOTELS
export async function getAllApprovedHotels() {
  const [rows] = await pool.query(`
    SELECT 
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type
    FROM HOTEL h
    JOIN HOTEL_TYPE ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'APPROVED'
  `);

  return rows;
}


//FETCH SINGLE HOTEL
export async function getHotelById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type,
      h.approval_status
    FROM HOTEL h
    JOIN HOTEL_TYPE ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.hotel_id = ?
    `,
    [id]
  );

  return rows[0];
}

// ADMIN > APPROVE / REJECT HOTEL
export async function approveHotel({
  hotel_id,
  approval_status,
  admin_id,
}) {
  const [result] = await pool.query(
    `
    UPDATE HOTEL
    SET 
      approval_status = ?,
      approved_by_admin_id = ?
    WHERE hotel_id = ?
    `,
    [approval_status, admin_id, hotel_id]
  );

  return result.affectedRows;
}
// Admin: fetch all pending hotels
export async function getPendingHotels() {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type,
      h.created_by_user_id,
      h.created_at
    FROM HOTEL h
    JOIN HOTEL_TYPE ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'PENDING'
    ORDER BY h.created_at DESC
  `);

  return rows;
}

// Hotel Manager: fetch own hotels
export async function getHotelsByManager(user_id) {
  const [rows] = await pool.query(
    `
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type,
      h.approval_status,
      h.created_at
    FROM HOTEL h
    JOIN HOTEL_TYPE ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.created_by_user_id = ?
    ORDER BY h.created_at DESC
    `,
    [user_id]
  );

  return rows;
}
