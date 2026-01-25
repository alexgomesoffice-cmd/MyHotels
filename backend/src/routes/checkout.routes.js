import { Router } from "express";
import {
  checkoutBooking,
  fetchCheckoutByBooking,
  fetchAllCheckouts,
} from "../controllers/checkout.controller.js";

import verifyToken, { checkUserBlocked } from "../auth/auth.middleware.js";

const router = Router();

/* ================= USER > CHECKOUT ================= */
router.post("/", verifyToken, checkUserBlocked, checkoutBooking);

/* ================= USER > VIEW CHECKOUT ================= */
router.get("/:booking_id", verifyToken, checkUserBlocked, fetchCheckoutByBooking);

/* ================= ADMIN > VIEW ALL ================= */
router.get("/admin/all", verifyToken, checkUserBlocked, fetchAllCheckouts);

export default router;
