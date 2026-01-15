import { Router } from "express";
import {
  checkoutBooking,
  fetchCheckoutByBooking,
  fetchAllCheckouts,
} from "../controllers/checkout.controller.js";

import verifyToken from "../auth/auth.middleware.js";

const router = Router();

/* ================= USER > CHECKOUT ================= */
router.post("/", verifyToken, checkoutBooking);

/* ================= USER > VIEW CHECKOUT ================= */
router.get("/:booking_id", verifyToken, fetchCheckoutByBooking);

/* ================= ADMIN > VIEW ALL ================= */
router.get("/admin/all", verifyToken, fetchAllCheckouts);

export default router;
