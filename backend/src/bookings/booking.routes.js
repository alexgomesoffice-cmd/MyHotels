import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import {
  getHotels,
  getRoomsByHotel,
  bookRoom,
  myBookings
} from "./booking.controller.js";

const router = express.Router();

router.get("/hotels", getHotels);
router.get("/hotels/:hotelId/rooms", getRoomsByHotel);
router.post("/book", authMiddleware, bookRoom);
router.get("/my-bookings", authMiddleware, myBookings);

export default router;
