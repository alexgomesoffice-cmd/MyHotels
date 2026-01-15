import { pool } from "../db.js";

/* ================= CREATE CHECKOUT ================= */
export async function createCheckout({
  booking_id,
  total_amount,
}) {
  // Prevent double checkout
  const [[existing]] = await pool.query(
    `
    SELECT checkout_id
    FROM checkout
    WHERE booking_id = ?
    `,
    [booking_id]
  );

  if (existing) {
    throw new Error("Checkout already completed for this booking");
  }

  const [result] = await pool.query(
    `
    INSERT INTO checkout
      (booking_id, checkout_date, total_amount)
    VALUES (?, NOW(), ?)
    `,
    [booking_id, total_amount]
  );

  return result.insertId;
}

/* ================= GET CHECKOUT BY BOOKING ================= */
export async function getCheckoutByBooking(booking_id) {
  const [[row]] = await pool.query(
    `
    SELECT
      c.checkout_id,
      c.checkout_date,
      c.total_amount,
      b.checkin_date,
      b.checkout_date AS stay_checkout_date,
      b.total_price,
      h.name AS hotel_name
    FROM checkout c
    JOIN booking b ON c.booking_id = b.booking_id
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    WHERE c.booking_id = ?
    `,
    [booking_id]
  );

  return row;
}

/* ================= ADMIN > ALL CHECKOUTS ================= */
export async function getAllCheckouts() {
  const [rows] = await pool.query(
    `
    SELECT
      c.checkout_id,
      c.checkout_date,
      c.total_amount,
      b.booking_id,
      u.name AS user_name,
      h.name AS hotel_name
    FROM checkout c
    JOIN booking b ON c.booking_id = b.booking_id
    JOIN user_details ud ON b.user_details_id = ud.user_details_id
    JOIN user u ON ud.user_id = u.user_id
    JOIN hotel_room_booking hrb ON b.booking_id = hrb.booking_id
    JOIN hotel_room_details r ON hrb.hotel_room_details_id = r.hotel_room_details_id
    JOIN hotel h ON r.hotel_id = h.hotel_id
    ORDER BY c.checkout_date DESC
    `
  );

  return rows;
}
