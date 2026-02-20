import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../db.js";

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded = { user_id, email, role_id }
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Middleware to check if user is blocked
export const checkUserBlocked = async (req, res, next) => {
  try {
    const user_id = req.user.user_id;

    const [users] = await pool.query(
      "SELECT is_blocked FROM `user` WHERE user_id = ?",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (users[0].is_blocked === 1) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    next();
  } catch (error) {
    console.error("Check blocked error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default verifyToken;
