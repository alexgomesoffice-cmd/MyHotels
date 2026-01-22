import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const hotelImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "myhotels/hotels",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const roomImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "myhotels/rooms",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

export const uploadHotelImages = multer({
  storage: hotelImageStorage,
});

export const uploadRoomImages = multer({
  storage: roomImageStorage,
});
