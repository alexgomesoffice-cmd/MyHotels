import express from "express";
console.log("✅ booking.routes.js LOADED");

import authMiddleware from "../auth/auth.middleware.js";
import {
  getHotels,
  getRoomsByHotel,
  bookRoom,
  myBookings,
} from "./booking.controller.js";

const router = express.Router();

/* ================= HOTELS ================= */

router.get("/hotels", getHotels);

/* ✅ THIS ROUTE IS REQUIRED */
router.get("/hotels/:hotelId/rooms", getRoomsByHotel);

/* ================= BOOKINGS ================= */

router.post("/book", authMiddleware, bookRoom);
router.get("/my-bookings", authMiddleware, myBookings);

export default router;
