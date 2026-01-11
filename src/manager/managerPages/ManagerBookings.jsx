const ManagerBookings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Bookings</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Hotel</th>
              <th className="p-3">Room</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">#123</td>
              <td className="p-3">Hotel A</td>
              <td className="p-3">101</td>
              <td className="p-3 text-green-600">CONFIRMED</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerBookings;
