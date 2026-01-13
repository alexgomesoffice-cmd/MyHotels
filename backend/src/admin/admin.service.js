import { pool } from "../db.js";

/* ================= ADMIN DASHBOARD ================= */

// Dashboard summary stats for admin
export const getDashboardStats = async () => {
  const [[hotels]] = await pool.query(
    "SELECT COUNT(*) total FROM hotel"
  );

  const [[pendingHotels]] = await pool.query(
    "SELECT COUNT(*) total FROM hotel WHERE approval_status = 'PENDING'"
  );

  const [[rooms]] = await pool.query(
    "SELECT COUNT(*) total FROM hotel_room_details"
  );

  const [[pendingRooms]] = await pool.query(
    "SELECT COUNT(*) total FROM hotel_room_details WHERE approval_status = 'PENDING'"
  );

  const [[bookings]] = await pool.query(
    "SELECT COUNT(*) total FROM booking"
  );

  return {
    hotels: hotels.total,
    pendingHotels: pendingHotels.total,
    rooms: rooms.total,
    pendingRooms: pendingRooms.total,
    bookings: bookings.total,
  };
};

/* ================= HOTELS ================= */

// Fetch all pending hotels
export const getPendingHotels = async () => {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type,
      u.name AS manager_name,
      h.created_at
    FROM hotel h
    JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
    JOIN user u ON h.created_by_user_id = u.user_id
    WHERE h.approval_status = 'pending'
    ORDER BY h.created_at DESC
  `);
  return rows;
};

// Approve / Reject hotel
export const updateHotelStatus = async (hotelId, status, adminId) => {
  const normalizedStatus = status.toLowerCase(); // 'APPROVED' → 'approved'

  await pool.query(`
    UPDATE hotel
    SET approval_status = ?, approved_by_admin_id = ?
    WHERE hotel_id = ?
  `, [normalizedStatus, adminId, hotelId]);
};

/* ================= ROOMS ================= */

// Fetch pending rooms
export const getPendingRooms = async () => {
  const [rows] = await pool.query(`
    SELECT
      r.hotel_room_details_id,
      r.room_number,
      r.price,
      h.name AS hotel_name,
      t.name AS room_type,
      u.name AS manager_name
    FROM hotel_room_details r
    JOIN hotel h ON r.hotel_id = h.hotel_id
    JOIN hotel_room_type t ON r.hotel_room_type_id = t.hotel_room_type_id
    JOIN user u ON r.created_by_user_id = u.user_id
    WHERE r.approval_status = 'PENDING'
  `);
  return rows;
};

// Approve / Reject room
export const updateRoomStatus = async (roomId, status, adminId) => {
  await pool.query(`
    UPDATE hotel_room_details
    SET approval_status = ?, approved_by_admin_id = ?
    WHERE hotel_room_details_id = ?
  `, [status, adminId, roomId]);
};

/* ================= BOOKINGS ================= */

export const getAllBookings = async () => {
  const [rows] = await pool.query(`
    SELECT
      b.booking_id,
      b.check_in,
      b.check_out,
      b.total_price,
      h.name AS hotel_name,
      r.room_number,
      u.name AS customer_name
    FROM booking b
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    JOIN user u ON b.user_id = u.user_id
    ORDER BY b.created_at DESC
  `);
  return rows;
};

/* ================= USERS ================= */

// Fetch all users
export const getAllUsers = async () => {
  const [rows] = await pool.query(`
    SELECT
      user_id,
      name,
      email,
      role_id,
      is_blocked,
      created_at
    FROM user
    ORDER BY created_at DESC
  `);

  return rows;
};

// Block / Unblock user
export const updateUserStatus = async (userId, isBlocked) => {
  await pool.query(
    `
    UPDATE user
    SET is_blocked = ?
    WHERE user_id = ?
  `,
    [isBlocked, userId]
  );
};


/* ================= HOTELS (ADMIN LIST) ================= */

// Fetch all hotels (ADMIN)
export const getAllHotels = async () => {
  const [rows] = await pool.query(`
    SELECT
      h.hotel_id,
      h.name,
      h.address,
      ht.name AS hotel_type,
      h.approval_status
    FROM hotel h
    JOIN hotel_type ht ON h.hotel_type_id = ht.hotel_type_id
    WHERE h.approval_status = 'approved'
    ORDER BY h.created_at DESC
  `);

  return rows;
};

// Delete hotel (admin)
export const deleteHotel = async (hotelId) => {
  // Delete rooms first (FK safety)
  await pool.query(
    "DELETE FROM hotel_room_details WHERE hotel_id = ?",
    [hotelId]
  );

  // Delete hotel
  await pool.query(
    "DELETE FROM hotel WHERE hotel_id = ?",
    [hotelId]
  );
};
