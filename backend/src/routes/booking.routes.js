import { Router } from "express";
import {
  addBooking,
  userCancelBooking,
  fetchMyBookings,
  fetchHotelBookings,
  fetchAllBookings,
  checkRoomAvailability,
  getUserBookingHistory,
} from "../controllers/booking.controller.js";
import verifyToken, { checkUserBlocked } from "../middlewares/auth.middleware.js";

const router = Router();

/* ================= USER > CREATE BOOKING ================= */

// Protected booking creation
router.post("/book", verifyToken, checkUserBlocked, addBooking);

/* ================= USER > CHECK AVAILABILITY ================= */

// Public or protected — keeping as-is
router.post("/check-availability", checkRoomAvailability);

/* ================= USER > CANCEL OWN BOOKING ================= */

router.patch("/cancel/:booking_id", verifyToken, checkUserBlocked, userCancelBooking);

/* ================= USER > VIEW OWN BOOKINGS ================= */

// user_id comes from JWT, NOT params
router.get("/user", verifyToken, checkUserBlocked, fetchMyBookings);

/* ================= HOTEL MANAGER > VIEW BOOKINGS ================= */

router.get("/manager/:manager_id", verifyToken, checkUserBlocked, fetchHotelBookings);

/* ================= ADMIN > VIEW ALL BOOKINGS ================= */

router.get("/admin", verifyToken, checkUserBlocked, fetchAllBookings);


/*booking hiatory*/

router.get("/history", verifyToken, checkUserBlocked, getUserBookingHistory);

export default router;
