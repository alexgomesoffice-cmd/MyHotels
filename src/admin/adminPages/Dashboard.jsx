import React, { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../data/api";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-gray-500 text-sm mb-2">
        {title}
      </h2>
      <p className="text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminDashboard();
      setStats(data);
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Hotels"
          value={stats.hotels}
        />

        <StatCard
          title="Pending Hotels"
          value={stats.pendingHotels}
        />

        <StatCard
          title="Total Rooms"
          value={stats.rooms}
        />

        <StatCard
          title="Pending Rooms"
          value={stats.pendingRooms}
        />

        <StatCard
          title="Total Bookings"
          value={stats.bookings}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
