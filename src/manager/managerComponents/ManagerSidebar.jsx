import React from "react";
import { NavLink } from "react-router-dom";

const ManagerSidebar = () => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md hover:bg-blue-50 ${
      isActive
        ? "bg-blue-100 font-semibold text-blue-600"
        : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-5 hidden md:block">
      <ul className="space-y-2">
        <li>
          <NavLink to="/manager" className={linkClass} end>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/manager/hotels" className={linkClass}>
            My Hotels
          </NavLink>
        </li>

        <li>
          <NavLink to="/manager/rooms" className={linkClass}>
            Rooms
          </NavLink>
        </li>

        <li>
          <NavLink to="/manager/bookings" className={linkClass}>
            Bookings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default ManagerSidebar;
