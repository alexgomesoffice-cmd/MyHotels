import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar/Navbar";
import { getUserBookingHistory, cancelBooking } from "../data/api";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getUserBookingHistory();
        setBookings(data || []);
      } catch (err) {
        console.error("Booking history load failed", err);
        setError("Failed to load booking history");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // ===============================
  // Cancel booking handler
  // ===============================
  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await cancelBooking(bookingId);

      // Update UI instantly
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId
            ? { ...b, status: "CANCELLED" }
            : b
        )
      );
    } catch (err) {
      console.error("Cancel booking failed", err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Booking History</h2>

          {loading && <p className="text-gray-500">Loading bookings...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && bookings.length === 0 && (
            <p className="text-gray-500">You have no confirmed bookings.</p>
          )}

          {!loading && bookings.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Hotel
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Check-in
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Check-out
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Rooms
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((b) => {
                    const checkInPassed =
                      new Date(b.checkin_date) <= new Date();

                    return (
                      <tr
                        key={b.booking_id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{b.hotel_name}</td>

                        <td className="px-4 py-3 text-gray-600">
                          {b.hotel_address}
                        </td>

                        <td className="px-4 py-3">
                          {new Date(b.checkin_date).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3">
                          {new Date(b.checkout_date).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {b.rooms_booked}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                          TK {Number(b.total_price).toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              b.status === "CONFIRMED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
  {b.status === "CONFIRMED" && (
    <button
  disabled={new Date(b.checkin_date) <= new Date()}
  onClick={() => handleCancel(b.booking_id)}
  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
    ${
      new Date(b.checkin_date) <= new Date()
        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 active:scale-95"
    }`}
>
  Cancel
</button>

  )}

  {b.status === "CANCELLED" && (
    <span className="text-red-500 font-medium text-sm">
      CANCELLED
    </span>
  )}
</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingHistory;
