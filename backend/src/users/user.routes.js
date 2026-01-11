import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import {
  getUserProfile,
  updateUserProfile,
} from "./user.controller.js";

const router = express.Router();

// Get logged-in user profile
router.get("/me", authMiddleware, getUserProfile);

// Update logged-in user profile
router.put("/me", authMiddleware, updateUserProfile);

export default router;
