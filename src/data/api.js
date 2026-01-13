import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
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

export const searchHotels = async (query) => {
  const response = await api.get(`/hotels/search?q=${query}`);
  return response.data;
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

export const getHotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};

/* ================= MANAGER ================= */

export const fetchManagerDashboard = async () => {
  const response = await api.get("/manager/dashboard");
  return response.data;
};

/* ================= ADMIN ================= */

// 🔹 Pending hotels
export const fetchPendingHotels = async () => {
  const response = await api.get("/admin/hotels/pending");
  return response.data;
};

// 🔹 Approve / Reject hotel
export const decideHotel = async (hotel_id, status) => {
  const response = await api.post("/admin/hotels/decision", {
    hotel_id,
    status,
  });
  return response.data;
};

// Fetch pending rooms
export const fetchPendingRooms = async () => {
  const response = await api.get("/admin/rooms/pending");
  return response.data;
};

// Approve / Reject room
export const decideRoom = async (roomId, status) => {
  const response = await api.post("/admin/rooms/decision", {
    room_id: roomId,
    approval_status: status,
    status: status,
  });

  return response.data;
};
export default api;

export const fetchAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Fetch all users (admin)
export const fetchAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Block / Unblock user
export const toggleUserStatus = async (userId, isBlocked) => {
  const response = await api.post("/admin/users/status", {
    user_id: userId,
    is_blocked: isBlocked,
  });
  return response.data;
};

// Fetch all hotels (admin)
export const fetchAllAdminHotels = async () => {
  const response = await api.get("/admin/hotels");
  return response.data;
};

// Delete hotel (admin)
export const deleteHotel = async (hotelId) => {
  const response = await api.delete(`/admin/hotels/${hotelId}`);
  return response.data;
};

/* ================= BOOKINGS ================= */

export const fetchApprovedHotels = async () => {
  const res = await api.get("/bookings/hotels");
  return res.data;
};

export const fetchRoomsByHotel = async (hotelId) => {
  const res = await api.get(`/bookings/hotels/${hotelId}/rooms`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await api.post("/bookings/book", data);
  return res.data;
};

export const fetchMyBookings = async () => {
  const res = await api.get("/bookings/my-bookings");
  return res.data;
};
