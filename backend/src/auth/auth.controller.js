import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import dotenv from "dotenv";

dotenv.config();

// USER REGISTRATION
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body; // ✅ roleId added

    // Validation
    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allow only valid roles
    const ALLOWED_ROLES = [1, 2, 3];
    if (!ALLOWED_ROLES.includes(roleId)) {
      return res.status(400).json({ message: "Invalid role" });
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

    // Insert user with selected role
    const [result] = await pool.query(
      "INSERT INTO `user` (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, roleId]
    );

    const user_id = result.insertId;

    // Create token
    const token = jwt.sign(
      {
        user_id,
        email,
        role_id: roleId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token + user
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        user_id,
        name,
        email,
        role_id: roleId,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};


// USER LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM `user` WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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
