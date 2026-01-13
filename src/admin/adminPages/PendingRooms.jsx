import React, { useEffect, useState } from "react";
import {
  fetchPendingRooms,
  decideRoom,
} from "../../data/api";

const PendingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingRooms();
      setRooms(data);
    } catch (err) {
      console.error("FETCH PENDING ROOMS ERROR:", err);
      setError("Failed to load pending rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleAction = async (roomId, status) => {
    try {
      await decideRoom(roomId, status);
      loadRooms(); // refresh list
    } catch (err) {
      console.error("UPDATE ROOM STATUS ERROR:", err);
      alert("Failed to update room status");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading pending rooms...
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Pending Rooms
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Hotel</th>
              <th className="p-3">Room No</th>
              <th className="p-3">Room Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.hotel_room_details_id}
                className="border-t"
              >
                <td className="p-3">{room.hotel_name}</td>
                <td className="p-3">{room.room_number}</td>
                <td className="p-3">{room.room_type}</td>
                <td className="p-3">৳ {room.price}</td>
                <td className="p-3">{room.manager_name}</td>

                <td className="p-3 space-x-2">
                  <button
                    onClick={() =>
                      handleAction(
                        room.hotel_room_details_id,
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
                        room.hotel_room_details_id,
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

        {rooms.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No pending rooms
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingRooms;
