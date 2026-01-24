import * as managerService from "./manager.service.js";
import { getAllRoomTypes } from "../roomType/roomType.model.js";
import { pool } from "../db.js";

export const getManagerDashboard = async (req, res) => {
  try {
    const data = await managerService.dashboard(req.user.user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getManagerHotels = async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);
    const hotels = await managerService.hotels(req.user.user_id);
    res.json(hotels);
  } catch (err) {
    console.error("MANAGER HOTELS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createHotel = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const { name, address, description, hotel_type_id } = req.body;
    const managerId = req.user.user_id;

    if (!name || !address || !description || !hotel_type_id) {
  await connection.rollback();
  connection.release();
  return res.status(400).json({
    message: "All fields are required",
  });
}


    const [hotelResult] = await connection.query(
      `INSERT INTO hotel
       (name, address, description, hotel_type_id, created_by_user_id, approval_status)
       VALUES (?, ?, ?, ?, ?, 'PENDING')`,
      [name, address, description, hotel_type_id, managerId]
    );

    const hotelId = hotelResult.insertId;

    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file) => [
        hotelId,
        file.path,
        file.filename,
      ]);

      await connection.query(
        `INSERT INTO hotel_images
         (hotel_id, image_url, image_public_id)
         VALUES ?`,
        [imageValues]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Hotel created and sent for approval",
      hotel_id: hotelId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("CREATE HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};


export const getManagerRooms = async (req, res) => {
  try {
    const rooms = await managerService.rooms(req.user.user_id);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createRoom = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const {
      hotel_id,
      hotel_room_type_id,
      room_number,
      price,
    } = req.body;

    const managerId = req.user.user_id;

    if (!hotel_id || !hotel_room_type_id || !room_number || !price) {
  await connection.rollback();
  connection.release();
  return res.status(400).json({
    message: "All fields are required",
  });
}

    // Check if hotel exists, belongs to manager, and is approved
    const [hotelCheck] = await connection.query(
      `SELECT approval_status FROM hotel WHERE hotel_id = ? AND created_by_user_id = ?`,
      [hotel_id, managerId]
    );

    if (hotelCheck.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({
        message: "Hotel not found or you don't have permission to add rooms to this hotel",
      });
    }

    if (hotelCheck[0].approval_status !== 'APPROVED') {
      await connection.rollback();
      connection.release();
      return res.status(403).json({
        message: "You can only add rooms to approved hotels",
      });
    }

    const [roomResult] = await connection.query(
      `INSERT INTO hotel_room_details
       (hotel_id, hotel_room_type_id, room_number, price, created_by_user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [
        hotel_id,
        hotel_room_type_id,
        room_number,
        price,
        managerId,
      ]
    );

    const roomId = roomResult.insertId;

    if (req.files && req.files.length > 0) {
      const imageValues = req.files.map((file) => [
        roomId,
        file.path,
        file.filename,
      ]);

      await connection.query(
        `INSERT INTO hotel_room_images
         (hotel_room_details_id, image_url, image_public_id)
         VALUES ?`,
        [imageValues]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Room created and sent for approval",
      room_id: roomId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

export const getManagerBookings = async (req, res) => {
  try {
    const bookings = await managerService.bookings(req.user.user_id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchRoomTypes = async (req, res) => {
  try {
    const roomTypes = await getAllRoomTypes();
    res.json(roomTypes);
  } catch (error) {
    console.error("FETCH ROOM TYPES ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch room types",
      error: error.message,
    });
  }
};
