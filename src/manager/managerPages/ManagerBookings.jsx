import React from "react";

const ManagerBookings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Guest</th>
            <th className="p-3">Hotel</th>
            <th className="p-3">Room</th>
            <th className="p-3">Check-in</th>
            <th className="p-3">Check-out</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>{/* bookings map */}</tbody>
      </table>
    </div>
  );
};

export default ManagerBookings;
