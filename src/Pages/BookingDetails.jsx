import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { createBooking } from "../data/api";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const BookingDetails = () => {
  const location = useLocation();
  const { room } = location.state || {};

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!room) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-500 mb-4">Invalid booking session</p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const totalNights =
    checkIn && checkOut
      ? (new Date(checkOut) - new Date(checkIn)) /
        (1000 * 60 * 60 * 24)
      : 0;

  const totalPrice =
    totalNights > 0
      ? totalNights * room.price * roomsCount
      : 0;

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    if (checkIn < today) {
      setError("Check-in date cannot be in the past");
      return;
    }

    if (totalNights < 1) {
      setError("Stay must be at least 1 night");
      return;
    }

    setLoading(true);

    try {
      const response = await createBooking({
        hotel_room_details_id: room.hotel_room_details_id,
        checkin_date: checkIn,
        checkout_date: checkOut,
        for_room: roomsCount,
        total_price: totalPrice,
      });

      // ✅ Defensive check
      if (!response || !response.message) {
        throw new Error("Invalid booking response");
      }

      setSuccess(response.message);

      // 🔄 Reset form
      setCheckIn("");
      setCheckOut("");
      setRoomsCount(1);
    } catch (err) {
      console.error("BOOKING ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to confirm booking"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="max-w-xl w-full px-4">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Confirm Your Booking
          </h1>

          {error && (
            <p className="text-red-500 mb-3 text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 mb-3 text-center font-semibold">
              {success}
            </p>
          )}

          <div className="bg-white shadow rounded-lg p-5 space-y-4">
            <p>
              <strong>Room Type:</strong> {room.room_type}
            </p>

            <p>
              <strong>Price / Night:</strong> ৳{room.price}
            </p>

            <div>
              <label className="block font-medium mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Number of Rooms
              </label>
              <select
                value={roomsCount}
                onChange={(e) =>
                  setRoomsCount(Number(e.target.value))
                }
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <hr />

            <p className="text-lg font-semibold text-center">
              Total Price: ৳{totalPrice}
            </p>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingDetails;
