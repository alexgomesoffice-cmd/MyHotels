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

    // FIXED #6: Validate hotel_type_id exists
    const [hotelTypeCheck] = await connection.query(
      `SELECT hotel_type_id FROM hotel_type WHERE hotel_type_id = ?`,
      [hotel_type_id]
    );

    if (hotelTypeCheck.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        message: "Invalid hotel_type_id. Hotel type does not exist",
      });
    }

    // Check for duplicate hotel (same name, address, location, and type)
    const [duplicateHotel] = await connection.query(
      `SELECT hotel_id FROM hotel WHERE name = ? AND address = ? AND hotel_type_id = ? AND approval_status != 'REJECTED'`,
      [name, address, hotel_type_id]
    );

    if (duplicateHotel.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({
        message: "A hotel with the same name, address, and type already exists",
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

    console.log(`🔍 CREATE ROOM REQUEST: hotel_id=${hotel_id}, room_number=${room_number}, manager_id=${managerId}`);

    if (!hotel_id || !hotel_room_type_id || !room_number || !price) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate price is greater than 0
    if (Number(price) <= 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        message: "Price must be greater than 0",
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

    // Check if room number already exists for this hotel
    const [existingRoom] = await connection.query(
      `SELECT hotel_room_details_id FROM hotel_room_details WHERE hotel_id = ? AND room_number = ?`,
      [hotel_id, room_number]
    );

    if (existingRoom.length > 0) {
      await connection.rollback();
      connection.release();
      console.warn(`⚠️ DUPLICATE ROOM ATTEMPT: room_number=${room_number} already exists for hotel_id=${hotel_id}`);
      return res.status(409).json({
        message: `Room number ${room_number} already exists for this hotel`,
      });
    }

    // FIXED #7: Validate hotel_room_type_id exists
    const [roomTypeCheck] = await connection.query(
      `SELECT hotel_room_type_id FROM hotel_room_type WHERE hotel_room_type_id = ?`,
      [hotel_room_type_id]
    );

    if (roomTypeCheck.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        message: "Invalid hotel_room_type_id. Room type does not exist",
      });
    }

    const [roomResult] = await connection.query(
      `INSERT INTO hotel_room_details
       (hotel_id, hotel_room_type_id, room_number, price, created_by_user_id, approval_status)
       VALUES (?, ?, ?, ?, ?, 'PENDING')`,
      [
        hotel_id,
        hotel_room_type_id,
        room_number,
        price,
        managerId,
      ]
    );

    const roomId = roomResult.insertId;

    console.log(`✅ ROOM CREATED: room_id=${roomId}, room_number=${room_number}, hotel_id=${hotel_id}`);

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
    console.error("❌ CREATE ROOM ERROR:", error.code, error.message);
    
    // Handle unique constraint violation
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: `Room number ${req.body.room_number} already exists for this hotel`,
      });
    }
    
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
