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
import managerOnly from "../middlewares/managerOnly.js";
import adminOnly from "../middlewares/adminOnly.js";

const router = express.Router();

console.log("HOTEL ROUTES FILE LOADED");

// Admin 
router.patch("/admin/approve", verifyToken, checkUserBlocked, adminOnly, adminApproveHotel);
router.get("/admin/pending", verifyToken, checkUserBlocked, adminOnly, fetchPendingHotels);

// Hotel manager - FIXED: Added managerOnly middleware and removed :user_id parameter
router.post("/", verifyToken, checkUserBlocked, managerOnly, addHotel);
router.get("/manager", verifyToken, checkUserBlocked, managerOnly, fetchMyHotels);

// Public
router.get("/", fetchHotels);
router.get("/:id", fetchHotelById);

export default router;
