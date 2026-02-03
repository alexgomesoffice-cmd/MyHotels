import { pool } from "../db.js";


// GET USER PROFILE

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
        u.phone,
        d.user_details_id,
        d.dob,
        d.gender,
        d.phone as details_phone,
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
    const profile = rows[0];
    // Prefer phone from user_details if available, otherwise from user table
    if (profile.details_phone) {
      profile.phone = profile.details_phone;
    }
    delete profile.details_phone;

    return res.status(200).json(profile);
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};


// UPDATE USER PROFILE

export const updateUserProfile = async (req, res) => {
  try {
    const { user_id } = req.user;

    const {
      name,
      phone = null,
      dob = null,
      gender = null,
      address = null,
    } = req.body;

    // Validation
    if (name && typeof name !== 'string') {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (phone && typeof phone !== 'string') {
      return res.status(400).json({ message: "Phone must be a valid phone number" });
    }

    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: "Gender must be Male, Female, or Other" });
    }

    if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ message: "Date of birth must be in YYYY-MM-DD format" });
    }

    // Update name and phone in user table if provided
    if (name || phone) {
      const updates = [];
      const params = [];

      if (name) {
        updates.push("name = ?");
        params.push(name);
      }

      if (phone) {
        updates.push("phone = ?");
        params.push(phone);
      }

      params.push(user_id);

      await pool.query(
        `UPDATE \`user\` SET ${updates.join(", ")} WHERE user_id = ?`,
        params
      );
    }

    // Check if user_details exists
    const [existing] = await pool.query(
      `SELECT user_details_id FROM user_details WHERE user_id = ?`,
      [user_id]
    );

    if (existing.length === 0) {
      // Insert new row
      await pool.query(
        `
        INSERT INTO user_details (user_id, phone, dob, gender, address)
        VALUES (?, ?, ?, ?, ?)
        `,
        [user_id, phone, dob, gender, address]
      );
    } else {
      // Update existing row
      await pool.query(
        `
        UPDATE user_details
        SET phone = ?, dob = ?, gender = ?, address = ?
        WHERE user_id = ?
        `,
        [phone, dob, gender, address, user_id]
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
