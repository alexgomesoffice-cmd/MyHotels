import express from "express";
import {
  getAdminDashboard,
  getPendingHotels,
  approveRejectHotel,
  getPendingRooms,
  approveRejectRoom,
  getAllBookings,
  getAllUsers,
  updateUserStatus,
  getAllHotels,
  deleteHotel,
  deleteUser
} 
from "../controllers/admin.controller.js";



import authMiddleware from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/adminOnly.js";

const router = express.Router();

/* ================= DASHBOARD ================= */

router.get("/dashboard", authMiddleware, adminOnly, getAdminDashboard);

/* ================= HOTELS ================= */

router.get(
  "/hotels/pending",
  authMiddleware,
  adminOnly,
  getPendingHotels
);

router.post(
  "/hotels/decision",
  authMiddleware,
  adminOnly,
  approveRejectHotel
);

/* ================= ROOMS ================= */

router.get(
  "/rooms/pending",
  authMiddleware,
  adminOnly,
  getPendingRooms
);

router.post(
  "/rooms/decision",
  authMiddleware,
  adminOnly,
  approveRejectRoom
);

/* ================= BOOKINGS ================= */

router.get("/bookings", authMiddleware, adminOnly, getAllBookings);

router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.post("/users/status", authMiddleware, adminOnly, updateUserStatus);
router.delete("/users/:user_id", authMiddleware, adminOnly, deleteUser);


/* ================= HOTELS MANAGEMENT ================= */

router.get(
  "/hotels",
  authMiddleware,
  adminOnly,
  getAllHotels
);

router.delete(
  "/hotels/:hotelId",
  authMiddleware,
  adminOnly,
  deleteHotel
);

export default router;
