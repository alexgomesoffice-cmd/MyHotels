import { pool as db } from "../db.js";


/* ================= DASHBOARD ================= */

export const dashboard = async (managerId) => {
  const [[hotels]] = await db.query(
    "SELECT COUNT(*) total FROM hotel WHERE created_by_user_id = ?",
    [managerId]
  );

  const [[rooms]] = await db.query(
    "SELECT COUNT(*) total FROM hotel_room_details WHERE created_by_user_id = ?",
    [managerId]
  );

  const [[bookings]] = await db.query(`
    SELECT COUNT(*) total
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ?
  `, [managerId]);

  return {
    hotels: hotels.total,
    rooms: rooms.total,
    bookings: bookings.total,
  };
};

/* ================= HOTELS ================= */

export const hotels = async (managerId) => {
  const [rows] = await db.query(
    "SELECT * FROM hotel WHERE created_by_user_id = ?",
    [managerId]
  );
  return rows;
};

export const createHotel = async (managerId, data) => {
  const { name, address, hotel_type_id } = data;

  await db.query(
    `INSERT INTO hotel (name, address, hotel_type_id, created_by_user_id)
     VALUES (?, ?, ?, ?)`,
    [name, address, hotel_type_id, managerId]
  );
};

/* ================= ROOMS ================= */

export const rooms = async (managerId) => {
  const [rows] = await db.query(`
    SELECT r.*, h.name hotel_name, t.name room_type
    FROM hotel_room_details r
    JOIN hotel h ON r.hotel_id = h.hotel_id
    JOIN hotel_room_type t ON r.hotel_room_type_id = t.hotel_room_type_id
    WHERE r.created_by_user_id = ?
  `, [managerId]);

  return rows;
};

export const createRoom = async (managerId, data) => {
  const {
    hotel_id,
    hotel_room_type_id,
    room_number,
    price,
  } = data;

  await db.query(
    `INSERT INTO hotel_room_details
     (hotel_id, hotel_room_type_id, room_number, price, created_by_user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [hotel_id, hotel_room_type_id, room_number, price, managerId]
  );
};

/* ================= BOOKINGS ================= */

export const bookings = async (managerId) => {
  const [rows] = await db.query(`
    SELECT b.*, h.name hotel_name, r.room_number
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ?
  `, [managerId]);

  return rows;
};
