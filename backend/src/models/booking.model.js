import { pool } from "../db.js";

// ================= CREATE BOOKING (AUTO CONFIRMED) =================
console.log("🔹 INSERT BOOKING PARAMS:", {
  user_id,
  checkin_date,
  checkout_date,
  for_room,
  total_price,
});
export async function createBooking({
  user_details_id,
  checkin_date,
  checkout_date,
  for_room,
  total_price,
  hotel_room_details_id,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ TOTAL ROOMS FOR THIS ROOM TYPE
    const [[roomCount]] = await connection.query(
      `
      SELECT COUNT(*) AS total_rooms
      FROM HOTEL_ROOM_DETAILS
      WHERE hotel_room_details_id = ?
      `,
      [hotel_room_details_id]
    );

    if (!roomCount || roomCount.total_rooms === 0) {
      throw new Error("Room not found");
    }

    // 2️⃣ ALREADY BOOKED ROOMS (DATE OVERLAP)
    const [[booked]] = await connection.query(
      `
      SELECT COALESCE(SUM(b.for_room), 0) AS booked_rooms
      FROM BOOKING b
      JOIN HOTEL_ROOM_BOOKING hrb
        ON b.booking_id = hrb.booking_id
      WHERE hrb.hotel_room_details_id = ?
        AND b.status = 'CONFIRMED'
        AND b.checkin_date < ?
        AND b.checkout_date > ?
      `,
      [hotel_room_details_id, checkout_date, checkin_date]
    );

    const availableRooms =
      roomCount.total_rooms - booked.booked_rooms;

    if (availableRooms < for_room) {
      throw new Error(
        `Only ${availableRooms} room(s) available for selected dates`
      );
    }

    // 3️⃣ INSERT INTO BOOKING
    const [bookingResult] = await connection.query(
      `
      INSERT INTO BOOKING
      (user_details_id, checkin_date, checkout_date, for_room, total_price, status)
      VALUES (?, ?, ?, ?, ?, 'CONFIRMED')
      `,
      [
        user_details_id,
        checkin_date,
        checkout_date,
        for_room,
        total_price,
      ]
    );

    const booking_id = bookingResult.insertId;

    // 4️⃣ LINK BOOKING TO ROOM
    await connection.query(
      `
      INSERT INTO HOTEL_ROOM_BOOKING
      (booking_id, hotel_room_details_id)
      VALUES (?, ?)
      `,
      [booking_id, hotel_room_details_id]
    );

    await connection.commit();
    return booking_id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ================= CANCEL BOOKING =================

export async function cancelBooking({ booking_id }) {
  const [result] = await pool.query(
    `
    UPDATE BOOKING
    SET status = 'CANCELLED'
    WHERE booking_id = ?
    `,
    [booking_id]
  );

  return result.affectedRows;
}

// ================= USER > VIEW OWN BOOKINGS =================

export async function getBookingsByUser(user_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      h.name AS hotel_name,
      r.room_number,
      r.price
    FROM BOOKING b
    JOIN USER_DETAILS ud ON b.user_details_id = ud.user_details_id
    JOIN HOTEL_ROOM_BOOKING hrb ON b.booking_id = hrb.booking_id
    JOIN HOTEL_ROOM_DETAILS r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN HOTEL h ON r.hotel_id = h.hotel_id
    WHERE ud.user_id = ?
    ORDER BY b.created_at DESC
    `,
    [user_id]
  );

  return rows;
}

// ================= HOTEL MANAGER > VIEW BOOKINGS =================

export async function getBookingsByHotelManager(manager_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      h.name AS hotel_name,
      r.room_number
    FROM BOOKING b
    JOIN HOTEL_ROOM_BOOKING hrb ON b.booking_id = hrb.booking_id
    JOIN HOTEL_ROOM_DETAILS r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN HOTEL h ON r.hotel_id = h.hotel_id
    WHERE h.created_by_user_id = ?
    ORDER BY b.created_at DESC
    `,
    [manager_id]
  );

  return rows;
}

// ================= ADMIN > VIEW ALL BOOKINGS =================

export async function getAllBookings() {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_room,
      b.total_price,
      b.status,
      u.name AS user_name,
      h.name AS hotel_name
    FROM BOOKING b
    JOIN USER_DETAILS ud ON b.user_details_id = ud.user_details_id
    JOIN USER u ON ud.user_id = u.user_id
    JOIN HOTEL_ROOM_BOOKING hrb ON b.booking_id = hrb.booking_id
    JOIN HOTEL_ROOM_DETAILS r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN HOTEL h ON r.hotel_id = h.hotel_id
    ORDER BY b.created_at DESC
    `
  );

  return rows;
}

// ================= CHECK ROOM AVAILABILITY =================

export const isRoomAvailable = async ({
  hotel_room_details_id,
  checkin_date,
  checkout_date,
  for_room,
}) => {
  const [[roomCount]] = await pool.query(
    `
    SELECT COUNT(*) AS total_rooms
    FROM HOTEL_ROOM_DETAILS
    WHERE hotel_room_details_id = ?
    `,
    [hotel_room_details_id]
  );

  const [[booked]] = await pool.query(
    `
    SELECT COALESCE(SUM(b.for_room), 0) AS booked_rooms
    FROM BOOKING b
    JOIN HOTEL_ROOM_BOOKING hrb
      ON b.booking_id = hrb.booking_id
    WHERE hrb.hotel_room_details_id = ?
      AND b.status = 'CONFIRMED'
      AND b.checkin_date < ?
      AND b.checkout_date > ?
    `,
    [hotel_room_details_id, checkout_date, checkin_date]
  );

  return (
    roomCount.total_rooms - booked.booked_rooms >= for_room
  );
};
