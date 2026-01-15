import express from "express";
import {
  addRoom,
  adminApproveRoom,
  fetchApprovedRoomsByHotel,
} from "../controllers/room.controller.js";
import verifyToken from "../auth/auth.middleware.js";

const router = express.Router();

console.log("ROOM ROUTES LOADED");

// HOTEL MANAGER*/
router.post("/", verifyToken, addRoom);

// ADMIN
router.patch("/approve", verifyToken, adminApproveRoom);

// PUBLIC
router.get("/hotel/:hotel_id", fetchApprovedRoomsByHotel);

export default router;
