// src/admin/adminComponents/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md hover:bg-blue-50 ${
      isActive ? "bg-blue-100 font-semibold text-blue-600" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-5 hidden md:block">
      <ul className="space-y-2">
        <li>
          <NavLink to="/admin" className={linkClass} end>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/hotels" className={linkClass}>
            Hotels
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/pending-hotels" className={linkClass}>
            Pending Hotels
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/security" className={linkClass}>
            System & Security
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
