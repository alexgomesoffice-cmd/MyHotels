import React, { useEffect, useState } from "react";
import { fetchManagerDashboard } from "../../data/api";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetchManagerDashboard();
        setStats(data);
      } catch {
  setError("Failed to load dashboard data");
} finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Manager Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">My Hotels</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.hotels}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">My Rooms</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.rooms}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Bookings</h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.bookings}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;



