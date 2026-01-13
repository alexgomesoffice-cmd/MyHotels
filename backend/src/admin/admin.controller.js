import * as adminService from "./admin.service.js";

/* ================= ADMIN DASHBOARD ================= */

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await adminService.getDashboardStats();
    res.json(data);
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= HOTELS ================= */

export const getPendingHotels = async (req, res) => {
  try {
    const data = await adminService.getPendingHotels();
    res.json(data);
  } catch (err) {
    console.error("GET PENDING HOTELS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const approveRejectHotel = async (req, res) => {
  try {
    const { hotel_id, status } = req.body;
    await adminService.updateHotelStatus(
      hotel_id,
      status,
      req.user.user_id
    );
    res.json({ message: "Hotel status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= ROOMS ================= */

export const getPendingRooms = async (req, res) => {
  try {
    const data = await adminService.getPendingRooms();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approveRejectRoom = async (req, res) => {
  try {
    const { room_id, status } = req.body;
    await adminService.updateRoomStatus(
      room_id,
      status,
      req.user.user_id
    );
    res.json({ message: "Room status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= BOOKINGS ================= */

export const getAllBookings = async (req, res) => {
  try {
    const data = await adminService.getAllBookings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

// Block / Unblock user
export const updateUserStatus = async (req, res) => {
  const { user_id, is_blocked } = req.body;

  try {
    await adminService.updateUserStatus(user_id, is_blocked);
    res.json({ message: "User status updated" });
  } catch (err) {
    console.error("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

/* ================= HOTELS MANAGEMENT ================= */

// GET all hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await adminService.getAllHotels();
    res.json(hotels);
  } catch (err) {
    console.error("GET HOTELS ERROR:", err);
    res.status(500).json({ message: "Failed to load hotels" });
  }
};

// DELETE hotel
export const deleteHotel = async (req, res) => {
  const { hotelId } = req.params;

  try {
    await adminService.deleteHotel(hotelId);
    res.json({ message: "Hotel deleted successfully" });
  } catch (err) {
    console.error("DELETE HOTEL ERROR:", err);
    res.status(500).json({ message: "Failed to delete hotel" });
  }
};
