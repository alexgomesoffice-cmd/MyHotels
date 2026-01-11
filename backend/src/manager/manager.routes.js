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

const router = express.Router();

router.use(authMiddleware);

// Dashboard
router.get("/dashboard", getManagerDashboard);

// Hotels
router.get("/hotels", getManagerHotels);
router.post("/hotels", createHotel);

// Rooms
router.get("/rooms", getManagerRooms);
router.post("/rooms", createRoom);

// Bookings
router.get("/bookings", getManagerBookings);

export default router;
