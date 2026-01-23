import { pool } from "../db.js";

/* ================= MANAGER > UPLOAD ROOM IMAGE ================= */
export const uploadRoomImage = async (req, res) => {
  try {
    const { hotel_room_details_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      `
      INSERT INTO hotel_room_images (hotel_room_details_id, image_url)
      VALUES (?, ?)
      `,
      [hotel_room_details_id, imageUrl]
    );

    res.status(201).json({
      message: "Room image uploaded successfully",
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("UPLOAD ROOM IMAGE ERROR:", error);
    res.status(500).json({ message: "Failed to upload room image" });
  }
};

/* ================= PUBLIC > FETCH ROOM IMAGES ================= */
export const fetchRoomImages = async (req, res) => {
  try {
    const { hotel_room_details_id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM hotel_room_images
      WHERE hotel_room_details_id = ?
      `,
      [hotel_room_details_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("FETCH ROOM IMAGES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch room images" });
  }
};
