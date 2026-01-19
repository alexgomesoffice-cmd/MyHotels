// src/Pages/HotelDescription.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { fetchRoomsByHotel } from "../data/api";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const HotelDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelRes = await api.get(`/hotels/${id}`);
        setHotel(hotelRes.data);

        const roomsRes = await fetchRoomsByHotel(id);
        setRooms(roomsRes);
      } catch (err) {
        console.error("HOTEL DESCRIPTION ERROR:", err);
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20">Loading hotel...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-500">{error}</p>;
  }

  if (!hotel) {
    return <p className="text-center mt-20">Hotel not found</p>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
        <p className="text-gray-600 mb-2">{hotel.address}</p>
        <p className="text-gray-700 mb-6">
          {hotel.description || "No description provided by the manager."}
        </p>

        <h2 className="text-2xl font-semibold mb-4">Available Rooms</h2>

        {rooms.length === 0 ? (
          <p className="text-gray-500">
            No rooms available for this hotel.
          </p>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.hotel_room_details_id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{room.room_type}</p>
                  <p className="text-sm text-gray-500">Room #{room.room_number}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">TK {room.price} / night</p>
                  <button
                    onClick={() =>
                      navigate("/booking-details", {
                        state: { room },
                      })
                    }
                    className="mt-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HotelDescription;
