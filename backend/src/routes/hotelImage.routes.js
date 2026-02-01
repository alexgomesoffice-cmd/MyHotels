import express from "express";
import { upload, handleUploadError } from "../middlewares/upload.js";
import verifyToken from "../auth/auth.middleware.js";
import managerOnly from "../middlewares/managerOnly.js";
import {
  uploadHotelImage,
  fetchHotelImages,
} from "../controllers/hotelImage.controller.js";

const router = express.Router();

/* MANAGER > UPLOAD HOTEL IMAGE */
router.post(
  "/:hotel_id",
  verifyToken,
  managerOnly,
  upload.single("image"),
  handleUploadError,
  uploadHotelImage
);

/* PUBLIC > VIEW HOTEL IMAGES */
router.get("/:hotel_id", fetchHotelImages);

export default router;
