import express from "express";
import {
  addRoom,
  adminApproveRoom,
  fetchApprovedRoomsByHotel,
} from "../controllers/room.controller.js";

const router = express.Router();

console.log("ROOM ROUTES LOADED");

// Manager adds room (PENDING)
router.post("/", addRoom);

// Admin approve / reject room
router.patch("/approve", adminApproveRoom);

// Public: fetch approved rooms for hotel
router.get("/hotel/:hotel_id", fetchApprovedRoomsByHotel);

export default router;
