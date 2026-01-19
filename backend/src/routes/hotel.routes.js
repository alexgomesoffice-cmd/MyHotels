import express from "express";
import {
  fetchHotels,
  fetchHotelById,
  addHotel,
  adminApproveHotel,
  fetchPendingHotels,
  fetchMyHotels 
} from "../controllers/hotel.controller.js";

const router = express.Router();

console.log("HOTEL ROUTES FILE LOADED");

// Admin (move ABOVE dynamic routes)
router.patch("/admin/approve", adminApproveHotel);
router.get("/admin/pending", fetchPendingHotels);

// Hotel manager
router.post("/", addHotel);
router.get("/manager/:user_id", fetchMyHotels);

// Public
router.get("/", fetchHotels);
router.get("/:id", fetchHotelById);

export default router;
