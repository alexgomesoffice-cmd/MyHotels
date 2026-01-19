// src/data/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically (admin OR user)
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");

    const token = adminToken || userToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= PUBLIC ================= */

export const fetchAllHotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};

// Alias to avoid breaking existing imports
export const getHotels = fetchAllHotels;

export const searchHotels = async (query) => {
  const response = await api.get("/hotels");
  const q = query.toLowerCase();

  return response.data.filter((hotel) =>
    hotel.name?.toLowerCase().includes(q) ||
    hotel.address?.toLowerCase().includes(q)
  );
};

/* ================= USER ================= */

export const fetchMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await api.put("/users/me", data);
  return response.data;
};

/* ================= MANAGER ================= */

export const fetchManagerDashboard = async () => {
  const response = await api.get("/manager/dashboard");
  return response.data;
};

/* ================= ADMIN ================= */

export const fetchAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  // supports BOTH formats safely
  return response.data?.payload ?? response.data;
};
// Pending hotels
export const fetchPendingHotels = async () => {
  const response = await api.get("/admin/hotels/pending");
  return response.data;
};

// Approve / Reject hotel
export const decideHotel = async (hotel_id, status) => {
  const response = await api.post("/admin/hotels/decision", {
    hotel_id,
    status,
  });
  return response.data;
};

// Pending rooms
export const fetchPendingRooms = async () => {
  const response = await api.get("/admin/rooms/pending");
  return response.data;
};

// Approve / Reject room (CLEANED)
export const decideRoom = async (roomId, status) => {
  const response = await api.post("/admin/rooms/decision", {
    room_id: roomId,
    status,
  });
  return response.data;
};

// Users
export const fetchAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const toggleUserStatus = async (userId, isBlocked) => {
  const response = await api.post("/admin/users/status", {
    user_id: userId,
    is_blocked: isBlocked,
  });
  return response.data;
};

// Hotels management
export const fetchAllAdminHotels = async () => {
  const response = await api.get("/admin/hotels");
  return response.data;
};

export const deleteHotel = async (hotelId) => {
  const response = await api.delete(`/admin/hotels/${hotelId}`);
  return response.data;
};

/* ================= BOOKINGS ================= */

// Alias to prevent frontend break (approved hotels come from /hotels)
export const fetchApprovedHotels = fetchAllHotels;

export const fetchRoomsByHotel = async (hotelId) => {
  const res = await api.get(`/rooms/hotel/${hotelId}`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await api.post("/bookings/book", data);
  return res.data;
};

export const fetchMyBookings = async () => {
  const res = await api.get("/bookings/user");
  return res.data;
};

export default api;
