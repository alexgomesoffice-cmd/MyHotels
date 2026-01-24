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
        // HOTEL
        const hotelRes = await api.get(`/hotels/${id}`);
        setHotel(hotelRes.data);

        // ROOMS
        const roomsRes = await fetchRoomsByHotel(id);

        // ROOM IMAGES
        const roomsWithImages = await Promise.all(
          roomsRes.map(async (room) => {
            try {
              const imgRes = await api.get(
                `/room-images/${room.hotel_room_details_id}`
              );

              return {
                ...room,
                images: imgRes.data,
              };
            } catch {
              return {
                ...room,
                images: [],
              };
            }
          })
        );

        setRooms(roomsWithImages);
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

      {/* HOTEL IMAGE (RESTORED) */}
      {hotel.images && hotel.images.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-gray-100 rounded-xl shadow-sm flex justify-center">
            <img
              src={`http://localhost:5000/${hotel.images[0].image_url.replace(
                /\\/g,
                "/"
              )}`}
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
          <p className="text-gray-500">No rooms available for this hotel.</p>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => {
              const roomImage =
                room.images && room.images.length > 0
                  ? `http://localhost:5000/${room.images[0].image_url.replace(
                      /\\/g,
                      "/"
                    )}`
                  : null;

              return (
                <div
                  key={room.hotel_room_details_id}
                  className="border border-gray-200 rounded-xl p-5 flex gap-6 items-center hover:bg-gray-50 transition"
                >
                  {/* ROOM IMAGE */}
                  <div className="w-40 h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={roomImage || "/assets/Img/room.jpg"}
                      alt={room.room_type}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ROOM INFO */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {room.room_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Room #{room.room_number}
                    </p>
                  </div>

                  {/* PRICE & CTA */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      TK {room.price}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        / night
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
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HotelDescription;
