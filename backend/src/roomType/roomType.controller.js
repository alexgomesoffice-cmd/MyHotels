import { getAllRoomTypes } from "./roomType.model.js";

/* ================= ROOM TYPES ================= */

// FETCH ALL ROOM TYPES
export const fetchRoomTypes = async (req, res) => {
  try {
    const types = await getAllRoomTypes();
    res.json(types);
  } catch (error) {
    console.error("FETCH ROOM TYPES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch room types",
      error: error.message,
    });
  }
};
