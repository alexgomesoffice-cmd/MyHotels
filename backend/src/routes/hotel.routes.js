import express from "express";
import {
  fetchHotels,
  fetchHotelById,
  addHotel,
  adminApproveHotel,
  fetchPendingHotels,
  fetchMyHotels 
} from "../controllers/hotel.controller.js";
import verifyToken, { checkUserBlocked } from "../auth/auth.middleware.js";

const router = express.Router();

console.log("HOTEL ROUTES FILE LOADED");

// Admin 
router.patch("/admin/approve", verifyToken, checkUserBlocked, adminApproveHotel);
router.get("/admin/pending", verifyToken, checkUserBlocked, fetchPendingHotels);

// Hotel manager
router.post("/", verifyToken, checkUserBlocked, addHotel);
router.get("/manager/:user_id", verifyToken, checkUserBlocked, fetchMyHotels);

// Public
router.get("/", fetchHotels);
router.get("/:id", fetchHotelById);

export default router;
