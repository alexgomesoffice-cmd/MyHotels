import { Router } from "express";
import {
  addBooking,
  userCancelBooking,
  fetchMyBookings,
  fetchHotelBookings,
  fetchAllBookings,
  checkRoomAvailability,
} from "../controllers/booking.controller.js";

import verifyToken from "../auth/auth.middleware.js";

const router = Router();

/* ================= USER > CREATE BOOKING ================= */

// 🔐 Protected booking creation
router.post("/book", verifyToken, addBooking);

/* ================= USER > CHECK AVAILABILITY ================= */

// Public or protected — keeping as-is
router.post("/check-availability", checkRoomAvailability);

/* ================= USER > CANCEL OWN BOOKING ================= */

router.patch("/cancel/:booking_id", verifyToken, userCancelBooking);

/* ================= USER > VIEW OWN BOOKINGS ================= */

// ✅ user_id comes from JWT, NOT params
router.get("/user", verifyToken, fetchMyBookings);

/* ================= HOTEL MANAGER > VIEW BOOKINGS ================= */

router.get("/manager/:manager_id", verifyToken, fetchHotelBookings);

/* ================= ADMIN > VIEW ALL BOOKINGS ================= */

router.get("/admin", verifyToken, fetchAllBookings);

export default router;
