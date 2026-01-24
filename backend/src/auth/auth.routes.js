import { Router } from "express";
import { registerUser, loginUser } from "./auth.controller.js";

const router = Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

export default router;
