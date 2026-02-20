import express from "express";
import { getHotelTypes } from "../controllers/hotelType.controller.js";

const router = express.Router();

router.get("/", getHotelTypes);

export default router;
