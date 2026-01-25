import { pool as db } from "../db.js";

/* ================= DASHBOARD ================= */

export const dashboard = async (managerId) => {
  const [[hotels]] = await db.query(
    "SELECT COUNT(*) total FROM hotel WHERE created_by_user_id = ? AND approval_status = 'APPROVED'",
    [managerId]
  );

  const [[rooms]] = await db.query(
    "SELECT COUNT(*) total FROM hotel_room_details WHERE created_by_user_id = ? AND approval_status = 'APPROVED'",
    [managerId]
  );

  const [[bookings]] = await db.query(
    `
    SELECT COUNT(*) total
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ? AND h.approval_status = 'APPROVED' AND r.approval_status = 'APPROVED'
    `,
    [managerId]
  );

  return {
    hotels: hotels.total,
    rooms: rooms.total,
    bookings: bookings.total,
  };
};

/* ================= HOTELS ================= */

export const hotels = async (managerId) => {
  const [rows] = await db.query(
    "SELECT * FROM hotel WHERE created_by_user_id = ? AND approval_status = 'APPROVED'",
    [managerId]
  );
  return rows;
};

export const createHotel = async (managerId, data) => {
  const { name, address, description, hotel_type_id } = data;
  console.log(`$name,$adress,$description`)
  //  Check for duplicate hotel (same name + address + type)
  const [existing] = await db.query(
    `
    SELECT hotel_id
    FROM hotel
    WHERE name = ?
      AND address = ?
      AND hotel_type_id = ?
    `,
    [name, address, hotel_type_id]
  );

  if (existing.length > 0) {
    throw new Error(
      "Hotel with same name, address, and type already exists"
    );
  }

  //  Create as PENDING (description INCLUDED)
  await db.query(
    `
    INSERT INTO hotel
    (name, address, description, hotel_type_id, created_by_user_id, approval_status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
    `,
    [name, address, description, hotel_type_id, managerId]
  );
};

/* ================= ROOMS ================= */

export const rooms = async (managerId) => {
  const [rows] = await db.query(
    `
    SELECT
      r.*,
      h.name AS hotel_name,
      t.name AS room_type
    FROM hotel_room_details r
    JOIN hotel h ON r.hotel_id = h.hotel_id
    JOIN hotel_room_type t ON r.hotel_room_type_id = t.hotel_room_type_id
    WHERE r.created_by_user_id = ?
    `,
    [managerId]
  );

  return rows;
};

/* ================= CREATE ROOM ================= */

export const createRoom = async (managerId, data) => {
  const {
    hotel_id,
    hotel_room_type_id,
    room_number,
    price,
  } = data;

  await db.query(
    `
    INSERT INTO hotel_room_details
    (hotel_id, hotel_room_type_id, room_number, price, created_by_user_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [hotel_id, hotel_room_type_id, room_number, price, managerId]
  );
};

/* ================= BOOKINGS ================= */

export const bookings = async (managerId) => {
  const [rows] = await db.query(
    `
    SELECT
      b.*,
      h.name AS hotel_name,
      r.room_number
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ?
    `,
    [managerId]
  );

  return rows;
};


/* ===============================
   HOTEL IMAGES
================================ */
export const addHotelImages = async (hotel_id, files) => {
  if (!files || files.length === 0) return;

  const values = files.map((file) => [
    hotel_id,
    file.path,
    file.filename,
  ]);

  const sql = `
    INSERT INTO hotel_images (hotel_id, image_url, image_public_id)
    VALUES ?
  `;

  await db.query(sql, [values]);
};

/* ===============================
   ROOM IMAGES
================================ */
export const addRoomImages = async (
  hotel_room_details_id,
  files
) => {
  if (!files || files.length === 0) return;

  const values = files.map((file) => [
    hotel_room_details_id,
    file.path,
    file.filename,
  ]);

  const sql = `
    INSERT INTO hotel_room_images
      (hotel_room_details_id, image_url, image_public_id)
    VALUES ?
  `;

  await db.query(sql, [values]);
};
