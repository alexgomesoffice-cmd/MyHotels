import React, { useEffect, useState } from "react";
import api from "../../data/api";

const PendingHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  const fetchPendingHotels = async () => {
    try {
      const res = await api.get("/admin/hotels/pending");
      setHotels(res.data);
    } catch {
      setError("Failed to load pending hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (hotel_id, approval_status) => {
    try {
      await api.post("/admin/hotels/approve", {
        hotel_id,
        approval_status,
      });

      // refresh list
      fetchPendingHotels();
    } catch {
      alert("Failed to update hotel status");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading pending hotels...</p>;
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
              <tr key={hotel.hotel_id} className="border-t">
                <td className="p-3">{hotel.name}</td>
                <td className="p-3">{hotel.address}</td>
                <td className="p-3">{hotel.hotel_type}</td>
                <td className="p-3">{hotel.created_by_user_id}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      handleAction(hotel.hotel_id, "APPROVED")
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleAction(hotel.hotel_id, "REJECTED")
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
