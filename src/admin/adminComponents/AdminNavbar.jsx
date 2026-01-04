// src/admin/adminComponents/AdminNavbar.jsx
import React from "react";

const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-md px-5 py-4 flex items-center justify-between">
      <h1 className="font-bold text-xl text-blue-600">Admin Panel</h1>
      <div className="flex items-center gap-4">
        <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
          Profile
        </button>
        <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
