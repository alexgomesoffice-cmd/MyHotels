import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white px-5 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">

        {/* Logo */}
        <Link to="/" className="font-bold text-xl whitespace-nowrap flex gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
          </svg>
          MyHotels
        </Link>

        {/* Search */}
        <div className="flex flex-1 max-w-xl items-center gap-2 min-w-0">
          <input
            type="text"
            placeholder="Search hotels..."
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          />
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700">
            Search
          </button>
        </div>

        {/* Desktop Login/Register */}
        <div className="hidden sm:flex items-center gap-4">
          <Link to="/login">
            <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
              Login
            </button>
          </Link>

          <Link to="/register">
            <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 border border-blue-600">
              Register
            </button>
          </Link>
        </div>

        {/* Mobile Profile Menu */}
        <div className="sm:hidden relative">
          <button onClick={() => setProfileOpen(!profileOpen)} aria-label="Profile menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0" clipRule="evenodd" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-50">
              <ul className="flex flex-col text-center">
                <Link to="/login" onClick={() => setProfileOpen(false)}>
                  <li className="py-2 hover:bg-gray-100 cursor-pointer">Login</li>
                </Link>
                <Link to="/register" onClick={() => setProfileOpen(false)}>
                  <li className="py-2 hover:bg-gray-100 cursor-pointer">Register</li>
                </Link>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
