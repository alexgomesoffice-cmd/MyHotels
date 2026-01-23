import express from "express";
import { upload } from "../middlewares/upload.js";
import verifyToken from "../auth/auth.middleware.js";
import managerOnly from "../middlewares/managerOnly.js";
import {
  uploadRoomImage,
  fetchRoomImages,
} from "../controllers/roomImage.controller.js";

const router = express.Router();

/* MANAGER > UPLOAD ROOM IMAGE */
router.post(
  "/:hotel_room_details_id",
  verifyToken,
  managerOnly,
  upload.single("image"),
  uploadRoomImage
);

/* PUBLIC > VIEW ROOM IMAGES */
router.get("/:hotel_room_details_id", fetchRoomImages);

export default router;
