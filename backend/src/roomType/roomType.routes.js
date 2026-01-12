import express from "express";
import { fetchRoomTypes } from "./roomType.controller.js";

const router = express.Router();

/* ================= ROOM TYPES ================= */

router.get("/", fetchRoomTypes);

export default router;
