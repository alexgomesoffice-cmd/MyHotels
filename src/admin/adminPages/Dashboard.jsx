import React, { useEffect, useState } from "react";
import api from "../../data/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    hotels: 0,
    pendingHotels: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.users}</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Hotels</p>
          <h2 className="text-2xl font-bold">{stats.hotels}</h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Pending Hotels</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            {stats.pendingHotels}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Bookings</p>
          <h2 className="text-2xl font-bold">{stats.bookings}</h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
