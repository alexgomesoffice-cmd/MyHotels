import api from "../data/api";

/**
 * Search available hotels based on hero section filters
 * @param {Object} params
 */
export const searchAvailableHotels = async ({
  location,
  checkIn,
  checkOut,
  rooms,
}) => {
  const response = await api.post("/search/availability", {
    location,
    checkin_date: checkIn,
    checkout_date: checkOut,
    rooms,
  });

  return response.data;
};
