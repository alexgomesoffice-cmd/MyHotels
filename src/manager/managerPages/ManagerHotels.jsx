const ManagerHotels = () => {
  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text-2xl font-bold">My Hotels</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Hotel
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Sample Hotel</td>
              <td className="p-3">Dhaka</td>
              <td className="p-3">
                <span className="px-2 py-1 text-sm rounded bg-yellow-100 text-yellow-700">
                  PENDING
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerHotels;
