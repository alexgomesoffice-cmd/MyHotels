import { pool } from "../db.js";
import { getHotelImagesByHotelId } from "../models/hotelImage.model.js";

/* ================= MANAGER > UPLOAD HOTEL IMAGE ================= */
export const uploadHotelImage = async (req, res) => {
  try {
    const { hotel_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await pool.query(
      `
      INSERT INTO hotel_images (hotel_id, image_url)
      VALUES (?, ?)
      `,
      [hotel_id, imageUrl]
    );

    res.status(201).json({
      message: "Hotel image uploaded successfully",
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("UPLOAD HOTEL IMAGE ERROR:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

/* ================= PUBLIC > FETCH HOTEL IMAGES ================= */
export const fetchHotelImages = async (req, res) => {
  try {
    const images = await getHotelImagesByHotelId(req.params.hotel_id);
    res.json(images);
  } catch (error) {
    console.error("FETCH HOTEL IMAGES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch hotel images" });
  }
};
