import express from "express";
import {
  getAdminDashboard,
  getPendingHotels,
  approveRejectHotel,
  getPendingRooms,
  approveRejectRoom,
  getAllBookings,
} from "./admin.controller.js";

import authMiddleware from "../auth/auth.middleware.js";
import adminOnly from "../middlewares/adminOnly.js";

const router = express.Router();

/* ================= DASHBOARD ================= */

router.get("/dashboard", authMiddleware, adminOnly, getAdminDashboard);

/* ================= HOTELS ================= */

router.get("/hotels/pending", authMiddleware, adminOnly, getPendingHotels);
router.post("/hotels/decision", authMiddleware, adminOnly, approveRejectHotel);

/* ================= ROOMS ================= */

router.get("/rooms/pending", authMiddleware, adminOnly, getPendingRooms);
router.post("/rooms/decision", authMiddleware, adminOnly, approveRejectRoom);

/* ================= BOOKINGS ================= */

router.get("/bookings", authMiddleware, adminOnly, getAllBookings);

export default router;
