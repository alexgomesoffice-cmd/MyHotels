import {
  createCheckout,
  getCheckoutByBooking,
  getAllCheckouts,
} from "../models/checkout.model.js";
import { pool } from "../db.js";

/* ================= USER > CREATE CHECKOUT ================= */
export const checkoutBooking = async (req, res) => {
  try {
    const { booking_id, total_amount } = req.body;

    if (!booking_id || !total_amount) {
      return res.status(400).json({
        message: "booking_id and total_amount are required",
      });
    }

    // Validate total_amount is greater than 0
    if (Number(total_amount) <= 0) {
      return res.status(400).json({
        message: "Total amount must be greater than 0",
      });
    }

    // Verify the total_amount matches the booking's total_price
    const [[booking]] = await pool.query(
      `SELECT total_price FROM booking WHERE booking_id = ?`,
      [booking_id]
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if the provided total_amount matches the booking total_price
    if (Number(total_amount) !== Number(booking.total_price)) {
      return res.status(400).json({
        message: `Total amount mismatch. Expected: ${booking.total_price}, Provided: ${total_amount}`,
      });
    }

    const checkoutId = await createCheckout({
      booking_id,
      total_amount,
    });

    res.status(201).json({
      message: "Checkout completed successfully",
      checkout_id: checkoutId,
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    res.status(400).json({
      message: error.message || "Checkout failed",
    });
  }
};

/* ================= USER > VIEW CHECKOUT ================= */
export const fetchCheckoutByBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const checkout = await getCheckoutByBooking(booking_id);

    if (!checkout) {
      return res.status(404).json({
        message: "Checkout not found",
      });
    }

    res.json(checkout);
  } catch (error) {
    console.error("FETCH CHECKOUT ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch checkout",
    });
  }
};

/* ================= ADMIN > VIEW ALL CHECKOUTS ================= */
export const fetchAllCheckouts = async (req, res) => {
  try {
    const checkouts = await getAllCheckouts();
    res.json(checkouts);
  } catch (error) {
    console.error("FETCH ALL CHECKOUTS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch checkouts",
    });
  }
};
