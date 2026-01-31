import express from "express";
import {
  adminApproveRoom,
  fetchApprovedRoomsByHotel,
} from "../controllers/room.controller.js";
import verifyToken, { checkUserBlocked } from "../auth/auth.middleware.js";

const router = express.Router();

console.log("ROOM ROUTES LOADED");

// ADMIN
router.patch("/approve", verifyToken, checkUserBlocked, adminApproveRoom);

// PUBLIC
router.get("/hotel/:hotel_id", fetchApprovedRoomsByHotel);

export default router;
