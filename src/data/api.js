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
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// HOTELS

export const fetchAllHotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};

export const searchHotels = async (query) => {
  const response = await api.get(`/hotels/search?q=${query}`);
  return response.data;
};

// USER / PROFILE

export const fetchMyProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await api.put("/users/me", data);
  return response.data;
};

export default api;
