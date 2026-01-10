import { Router } from "express";
import {
  addBooking,
  userCancelBooking,
  fetchMyBookings,
  fetchHotelBookings,
  fetchAllBookings,
  checkRoomAvailability,
} from "../controllers/booking.controller.js";

const router = Router();


   //USER > CREATE BOOKING
router.post("/check-availability", checkRoomAvailability);
router.post("/", addBooking);


  // USER > CANCEL OWN BOOKING

router.patch("/cancel/:booking_id", userCancelBooking);


   //USER > VIEW OWN BOOKINGS

router.get("/user/:user_id", fetchMyBookings);


   //HOTEL MANAGER ? VIEW BOOKINGS

router.get("/manager/:manager_id", fetchHotelBookings);


   //ADMIN > VIEW ALL BOOKINGS

router.get("/admin", fetchAllBookings);

export default router;
