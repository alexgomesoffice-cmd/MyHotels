import { pool } from "../db.js";

// ===============================
// GET USER PROFILE
// ===============================
export const getUserProfile = async (req, res) => {
  try {
    // user_id injected by auth middleware (JWT)
    const { user_id } = req.user;

    const [rows] = await pool.query(
      `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        d.dob,
        d.gender,
        d.address
      FROM \`user\` u
      LEFT JOIN user_details d
        ON u.user_id = d.user_id
      WHERE u.user_id = ?
      `,
      [user_id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Always return ONE object
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

// ===============================
// UPDATE USER PROFILE
// ===============================
export const updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.user;

    const {
      name,
      dob = null,
      gender = null,
      address = null,
    } = req.body;

    // -------------------------------
    // Update name in user table
    // -------------------------------
    if (name) {
      await pool.query(
        `
        UPDATE \`user\`
        SET name = ?
        WHERE user_id = ?
        `,
        [name, user_id]
      );
    }

    // -------------------------------
    // Check if user_details exists
    // -------------------------------
    const [existing] = await pool.query(
      `
      SELECT user_details_id
      FROM user_details
      WHERE user_id = ?
      `,
      [user_id]
    );

    if (existing.length === 0) {
      // Insert new row
      await pool.query(
        `
        INSERT INTO user_details (user_id, dob, gender, address)
        VALUES (?, ?, ?, ?)
        `,
        [user_id, dob, gender, address]
      );
    } else {
      // Update existing row
      await pool.query(
        `
        UPDATE user_details
        SET dob = ?, gender = ?, address = ?
        WHERE user_id = ?
        `,
        [dob, gender, address, user_id]
      );
    }

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
