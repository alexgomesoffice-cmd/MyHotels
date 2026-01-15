import {
  createCheckout,
  getCheckoutByBooking,
  getAllCheckouts,
} from "../models/checkout.model.js";

/* ================= USER > CREATE CHECKOUT ================= */
export const checkoutBooking = async (req, res) => {
  try {
    const { booking_id, total_amount } = req.body;

    if (!booking_id || !total_amount) {
      return res.status(400).json({
        message: "booking_id and total_amount are required",
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
