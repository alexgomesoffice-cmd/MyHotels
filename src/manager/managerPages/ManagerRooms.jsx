const ManagerRooms = () => {
  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Room
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
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
            <tr className="border-t">
              <td className="p-3">Hotel A</td>
              <td className="p-3">101</td>
              <td className="p-3">Deluxe</td>
              <td className="p-3">$120</td>
              <td className="p-3 text-yellow-600">PENDING</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerRooms;
