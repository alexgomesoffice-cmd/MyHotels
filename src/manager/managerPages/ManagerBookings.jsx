import React, { useEffect, useState } from "react";
import api from "../../data/api";

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/manager/bookings");
      setBookings(res.data);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Hotel</th>
              <th className="p-3">Room</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.booking_id} className="border-t">
                <td className="p-3">{b.hotel_name}</td>
                <td className="p-3">{b.room_number}</td>
                <td className="p-3">{new Date(b.checkin_date).toLocaleDateString()}</td>
                <td className="p-3">{new Date(b.checkout_date).toLocaleDateString()}</td>
                <td className="p-3">TK {b.total_price}</td>
                <td className="p-3 font-semibold">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="text-center p-4 text-gray-500">
            No bookings found
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagerBookings;
