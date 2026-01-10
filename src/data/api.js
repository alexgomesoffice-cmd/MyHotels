import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// HOTELS
export const fetchAllHotels = async () => {
  const response = await api.get("/hotels");
  return response.data;
};

export default api;
