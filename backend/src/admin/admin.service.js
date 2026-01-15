import { pool } from "../db.js";

/* ================= ADMIN DASHBOARD ================= */

export const getDashboardStats = async () => {
  const [[totalHotels]] = await pool.query(
    `SELECT COUNT(*) AS count FROM hotel`
  );

  const [[pendingHotels]] = await pool.query(
    `SELECT COUNT(*) AS count FROM hotel WHERE approval_status = 'PENDING'`
  );

  const [[totalRooms]] = await pool.query(
    `SELECT COUNT(*) AS count FROM hotel_room_details`
  );

  const [[pendingRooms]] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM hotel_room_details
     WHERE approval_status = 'PENDING'`
  );

  const [[totalBookings]] = await pool.query(
    `SELECT COUNT(*) AS count FROM booking`
  );

  return {
    totalHotels: totalHotels.count,
    pendingHotels: pendingHotels.count,
    totalRooms: totalRooms.count,
    pendingRooms: pendingRooms.count,
    totalBookings: totalBookings.count,
  };
};

/* ================= HOTELS ================= */

export const getPendingHotels = async () => {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      h.created_at,
      u.name AS created_by,
      ht.name AS hotel_type
    FROM hotel h
    JOIN user u ON h.created_by_user_id = u.user_id
    JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'PENDING'
    ORDER BY h.created_at DESC
  `);

  return rows;
};

export const updateHotelStatus = async (hotel_id, status, admin_id) => {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid hotel status");
  }

  const [result] = await pool.query(
    `
    UPDATE hotel
    SET approval_status = ?, approved_by_admin_id = ?
    WHERE hotel_id = ?
    `,
    [status, admin_id, hotel_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Hotel not found");
  }
};

/* ================= ROOMS ================= */

export const getPendingRooms = async () => {
  const [rows] = await pool.query(`
    SELECT
      r.hotel_room_details_id,
      r.room_number,
      r.price,
      r.created_at,
      h.name AS hotel_name,
      rt.name AS room_type,
      u.name AS created_by
    FROM hotel_room_details r
    JOIN hotel h ON r.hotel_id = h.hotel_id
    JOIN hotel_room_type rt ON r.hotel_room_type_id = rt.hotel_room_type_id
    JOIN user u ON r.created_by_user_id = u.user_id
    WHERE r.approval_status = 'PENDING'
    ORDER BY r.created_at DESC
  `);

  return rows;
};

export const updateRoomStatus = async (room_id, status, admin_id) => {
  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid room status");
  }

  const [result] = await pool.query(
    `
    UPDATE hotel_room_details
    SET approval_status = ?, approved_by_admin_id = ?
    WHERE hotel_room_details_id = ?
    `,
    [status, admin_id, room_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Room not found");
  }
};

/* ================= BOOKINGS ================= */

export const getAllBookings = async () => {
  const [rows] = await pool.query(`
    SELECT
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      u.name AS user_name,
      u.email AS user_email,
      h.name AS hotel_name
    FROM booking b
    JOIN user_details ud ON b.user_details_id = ud.user_details_id
    JOIN user u ON ud.user_id = u.user_id
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    GROUP BY b.booking_id
    ORDER BY b.created_at DESC
  `);

  return rows;
};

/* ================= USERS ================= */

export const getAllUsers = async () => {
  const [rows] = await pool.query(`
    SELECT
      u.user_id,
      u.name,
      u.email,
      r.name AS role,
      u.is_blocked,
      u.created_at
    FROM user u
    JOIN role r ON u.role_id = r.role_id
    ORDER BY u.created_at DESC
  `);

  return rows;
};

export const updateUserStatus = async (user_id, is_blocked) => {
  const [result] = await pool.query(
    `
    UPDATE user
    SET is_blocked = ?
    WHERE user_id = ?
    `,
    [is_blocked, user_id]
  );

  if (result.affectedRows === 0) {
    throw new Error("User not found");
  }
};

/* ================= HOTELS MANAGEMENT ================= */

export const getAllHotels = async () => {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      h.approval_status,
      h.created_at,
      u.name AS created_by,
      ht.name AS hotel_type
    FROM hotel h
    JOIN user u ON h.created_by_user_id = u.user_id
    JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
    ORDER BY h.created_at DESC
  `);

  return rows;
};

export const deleteHotel = async (hotelId) => {
  await pool.query(
    `
    DELETE FROM hotel
    WHERE hotel_id = ?
    `,
    [hotelId]
  );
};
