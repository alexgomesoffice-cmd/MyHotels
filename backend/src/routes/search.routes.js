import express from "express";
import { searchAvailableHotels } from "../controllers/search.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// FIXED #10: Add rate limiting to prevent DoS attacks on search endpoint
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many search requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/*
  HERO SEARCH ONLY
*/
router.post("/availability", searchLimiter, searchAvailableHotels);

export default router;
