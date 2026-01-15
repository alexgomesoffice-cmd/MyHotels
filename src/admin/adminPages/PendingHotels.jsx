import React, { useEffect, useState } from "react";
import {
  fetchPendingHotels,
  decideHotel,
} from "../../data/api";

const PendingHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingHotels();
      setHotels(data);
    } catch (err) {
      console.error("FETCH PENDING HOTELS ERROR:", err);
      setError("Failed to load pending hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleAction = async (hotel_id, status) => {
    try {
      await decideHotel(hotel_id, status);
      loadHotels();
    } catch (err) {
      console.error("UPDATE HOTEL STATUS ERROR:", err);
      alert("Failed to update hotel status");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading pending hotels...
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Pending Hotels
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">Type</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {hotels.map((hotel) => (
              <tr
                key={hotel.hotel_id}
                className="border-t"
              >
                <td className="p-3">{hotel.name}</td>
                <td className="p-3">{hotel.address}</td>
                <td className="p-3">{hotel.hotel_type}</td>
                <td className="p-3">
                  {hotel.created_by}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      handleAction(
                        hotel.hotel_id,
                        "APPROVED"
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(
                        hotel.hotel_id,
                        "REJECTED"
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hotels.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No pending hotels
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingHotels;
