import { pool } from "../db.js";


   //CREATE BOOKING (AUTO CONFIRMED)

export async function createBooking({
  user_details_id,
  checkin_date,
  checkout_date,
  for_persons,
  total_price,
  hotel_room_details_id,
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert into BOOKING
    const [bookingResult] = await connection.query(
      `
      INSERT INTO BOOKING
      (user_details_id, checkin_date, checkout_date, for_persons, total_price)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        user_details_id,
        checkin_date,
        checkout_date,
        for_persons,
        total_price,
      ]
    );

    const booking_id = bookingResult.insertId;

    // Link booking to room
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

// CANCEL BOOKING

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

//USER > VIEW OWN BOOKINGS

export async function getBookingsByUser(user_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_persons,
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


//HOTEL MANAGER > VIEW BOOKINGS
export async function getBookingsByHotelManager(manager_id) {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_persons,
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


//ADMIN > VIEW ALL BOOKINGS

export async function getAllBookings() {
  const [rows] = await pool.query(
    `
    SELECT 
      b.booking_id,
      b.checkin_date,
      b.checkout_date,
      b.for_persons,
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
