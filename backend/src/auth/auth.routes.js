import { Router } from "express";
import { registerUser, loginUser } from "./auth.controller.js";

const router = Router();

// ===============================
// AUTH ROUTES
// ===============================

// {message part} Register user
router.post("/register", registerUser);

// {message part} Login user
router.post("/login", loginUser);

export default router;
