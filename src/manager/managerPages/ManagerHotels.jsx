import React, { useEffect, useState } from "react";

const ManagerHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // later: GET /manager/hotels
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Hotels</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Location</th>
            <th className="p-3">Status</th>
            <th className="p-3">Created</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map(hotel => (
            <tr key={hotel.id} className="border-t">
              <td className="p-3">{hotel.name}</td>
              <td className="p-3">{hotel.location}</td>
              <td className="p-3">{hotel.status}</td>
              <td className="p-3">{hotel.created_at}</td>
              <td className="p-3">
                <button className="text-blue-600">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerHotels;
