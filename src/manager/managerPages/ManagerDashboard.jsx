import React, { useEffect, useState } from "react";
import api from "../../data/api";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/manager/dashboard");
        setStats(res.data);
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Manager Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-gray-500">My Hotels</h3>
          <p className="text-3xl font-bold">{stats.hotels}</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-gray-500">My Rooms</h3>
          <p className="text-3xl font-bold">{stats.rooms}</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-gray-500">Bookings</h3>
          <p className="text-3xl font-bold">{stats.bookings}</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
