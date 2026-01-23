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
    return <p className="text-center mt-20 text-gray-500">Loading hotel...</p>;
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

      {hotel.images && hotel.images.length > 0 && (
  <div className="max-w-6xl mx-auto px-6 mt-6">
    <div className="bg-gray-100 rounded-xl shadow-sm flex justify-center">
      <img
        src={`http://localhost:5000/${hotel.images[0].image_url.replace(/\\/g, "/")}`}
        alt={hotel.name}
        className="max-h-[360px] w-auto object-contain rounded-xl"
      />
    </div>
  </div>
)}


      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">
          {hotel.name}
        </h1>

        <p className="text-gray-500 mb-4">{hotel.address}</p>

        <p className="text-gray-700 leading-relaxed max-w-3xl mb-10">
          {hotel.description || "No description provided by the manager."}
        </p>

        <h2 className="text-2xl font-medium text-gray-900 mb-6">
          Available Rooms
        </h2>

        {rooms.length === 0 ? (
          <p className="text-gray-500">
            No rooms available for this hotel.
          </p>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.hotel_room_details_id}
                className="border border-gray-200 rounded-lg p-5 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {room.room_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Room #{room.room_number}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    TK {room.price}
                    <span className="text-sm font-normal text-gray-500">
                      {" "} / night
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      navigate("/booking-details", {
                        state: { room },
                      })
                    }
                    className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
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
