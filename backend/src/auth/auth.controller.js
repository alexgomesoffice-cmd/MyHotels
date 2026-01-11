import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

// ===============================
// USER REGISTRATION
// ===============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing email
    const [existingUser] = await pool.query(
      "SELECT user_id FROM `user` WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role = CUSTOMER
    const DEFAULT_ROLE_ID = 1;

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO `user` (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, DEFAULT_ROLE_ID]
    );

    const user_id = result.insertId;

    // Create token
    const token = jwt.sign(
      {
        user_id,
        email,
        role_id: DEFAULT_ROLE_ID,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token + user (auto-login)
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        user_id,
        name,
        email,
        role_id: DEFAULT_ROLE_ID,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ===============================
// USER LOGIN
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Fetch user
    const [users] = await pool.query(
      "SELECT * FROM `user` WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
