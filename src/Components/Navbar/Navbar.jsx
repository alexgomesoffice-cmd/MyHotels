import React, { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white px-5 py-4">

      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">

        {/* Left - Logo */}
        <a href="#" className="font-bold text-xl whitespace-nowrap flex ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
</svg>
          MyHotels
        </a>

        {/* Center - Search Input + Button */}
        <div className="flex flex-1 max-w-xl items-center gap-2 min-w-0">
          <input
            type="text"
            placeholder="Search hotels..."
            className="border border-gray-300 rounded-md px-3 py-2 w-full  min-w-0"
          />
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md whitespace-nowrap hover:bg-blue-700">
            Search
          </button>
        </div>

        {/* Right - Login/Register (Desktop) */}
        <div className="hidden sm:flex items-center gap-4 whitespace-nowrap">
          <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
            Login
          </button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 border border-blue-600">
            Register
          </button>
        </div>

        {/* Profile Icon (Mobile) */}
        <div className="sm:hidden relative">
          <button onClick={() => setProfileOpen(!profileOpen)} aria-label="Profile menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>

          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border-none rounded-md shadow-lg z-50">
              <ul className="flex flex-col text-center">
                <li className="border-none py-2 hover:bg-gray-100 cursor-pointer rounded-md">Login</li>
                <li className="py-2 hover:bg-gray-100 cursor-pointer rounded-md">Register</li>
              </ul>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default Navbar;

