import express from "express";
import {
  getManagerDashboard,
  getManagerHotels,
  createHotel,
  getManagerRooms,
  createRoom,
  getManagerBookings,
} from "./manager.controller.js";

import authMiddleware from "../auth/auth.middleware.js";
import managerOnly from "../middlewares/managerOnly.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ===============================
   GLOBAL MANAGER AUTH
================================ */
router.use(authMiddleware, managerOnly);

/* ===============================
   DASHBOARD
================================ */
router.get("/dashboard", getManagerDashboard);

/* ===============================
   HOTELS
================================ */
router.get("/hotels", getManagerHotels);

router.post(
  "/hotels",
  upload.array("images", 10),
  createHotel
);

/* ===============================
   ROOMS
================================ */
router.get("/rooms", getManagerRooms);

router.post(
  "/rooms",
  upload.array("images", 10),
  createRoom
);

/* ===============================
   BOOKINGS
================================ */
router.get("/bookings", getManagerBookings);

export default router;
