import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "./user.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = express.Router();

// GET logged-in user's profile
router.get("/me", authenticate, getUserProfile);

// UPDATE logged-in user's profile
router.put("/me", authenticate, updateUserProfile);

export default router;
