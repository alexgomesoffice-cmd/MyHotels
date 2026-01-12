import express from "express";
import { getHotelTypes } from "./hotelType.controller.js";

const router = express.Router();

router.get("/", getHotelTypes);

export default router;
