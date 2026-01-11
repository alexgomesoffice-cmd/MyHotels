import React from "react";

const ManagerRooms = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rooms</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Hotel</th>
            <th className="p-3">Type</th>
            <th className="p-3">Price</th>
            <th className="p-3">Capacity</th>
            <th className="p-3">Available</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>{/* rooms later */}</tbody>
      </table>
    </div>
  );
};

export default ManagerRooms;
