import React, { useEffect, useState } from "react";
import { fetchAllAdminHotels, deleteHotel } from "../../data/api";

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await fetchAllAdminHotels();
      setHotels(data);
    } catch (err) {
      console.error("FAILED TO LOAD HOTELS:", err);
      alert("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleDelete = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteHotel(hotelId);
      loadHotels();
    } catch (err) {
      console.error("FAILED TO DELETE HOTEL:", err);
      alert("Failed to delete hotel");
    }
  };

  if (loading) {
    return <p className="p-6">Loading hotels...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Hotels Management
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {hotels.map((hotel) => (
              <tr key={hotel.hotel_id}>
                <td className="px-6 py-4">{hotel.hotel_id}</td>
                <td className="px-6 py-4">{hotel.name}</td>
                <td className="px-6 py-4">{hotel.address}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {hotel.hotel_type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(hotel.hotel_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {hotels.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hotels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelList;
