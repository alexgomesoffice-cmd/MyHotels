import * as managerService from "./manager.service.js";
import { getAllRoomTypes } from "../roomType/roomType.model.js";

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
  try {
    await managerService.createHotel(req.user.user_id, req.body);
    res.status(201).json({ message: "Hotel submitted for approval" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  try {
    await managerService.createRoom(req.user.user_id, req.body);
    res.status(201).json({ message: "Room submitted for approval" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

