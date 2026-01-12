import React, { useEffect, useState } from "react";
import api from "../../data/api";

const ManagerRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    hotel_id: "",
    hotel_room_type_id: "",
    room_number: "",
    price: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchHotels();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/manager/rooms");
      setRooms(res.data);
    } catch {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await api.get("/manager/hotels");
      setHotels(res.data);
    } catch {
      setError("Failed to load hotels");
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await api.get("/room-types");
      setRoomTypes(res.data);
    } catch {
      setError("Failed to load room types");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/manager/rooms", {
        ...formData,
        hotel_id: Number(formData.hotel_id),
        hotel_room_type_id: Number(formData.hotel_room_type_id),
        price: Number(formData.price),
      });

      setFormData({
        hotel_id: "",
        hotel_room_type_id: "",
        room_number: "",
        price: "",
      });

      fetchRooms();
    } catch {
      setError("Failed to create room");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading rooms...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Rooms</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* ADD ROOM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-4"
      >
        <h2 className="font-semibold">Add New Room</h2>

        {/* HOTEL DROPDOWN */}
        <select
          name="hotel_id"
          value={formData.hotel_id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.hotel_id} value={hotel.hotel_id}>
              {hotel.name}
            </option>
          ))}
        </select>

        {/* ROOM TYPE */}
        <select
          name="hotel_room_type_id"
          value={formData.hotel_room_type_id}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Room Type</option>
          {roomTypes.map((type) => (
            <option
              key={type.hotel_room_type_id}
              value={type.hotel_room_type_id}
            >
              {type.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="room_number"
          placeholder="Room Number"
          value={formData.room_number}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price per night"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">
          Submit for Approval
        </button>
      </form>

      {/* ROOM LIST */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Hotel</th>
              <th className="p-3">Room</th>
              <th className="p-3">Type</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.hotel_room_details_id} className="border-t">
                <td className="p-3">{room.hotel_name}</td>
                <td className="p-3">{room.room_number}</td>
                <td className="p-3">{room.room_type}</td>
                <td className="p-3">${room.price}</td>
                <td className="p-3 font-semibold">
                  {room.approval_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No rooms added yet
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerRooms;
