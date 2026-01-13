import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchHotels } from "../../data/api";

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  // keep Navbar synced with login/logout
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Backend search
  const handleChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    try {
      const results = await searchHotels(value);
      setSuggestions(results.slice(0, 5));
      setSuggestionsOpen(true);
    } catch {
      setSuggestions([]);
      setSuggestionsOpen(false);
    }
  };

  const handleSelect = (hotel) => {
    navigate(`/hotels/${hotel.id}`);
    setSearchTerm("");
    setSuggestions([]);
    setSuggestionsOpen(false);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
      setSuggestions([]);
      setSuggestionsOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <header className="bg-white px-5 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">

        {/* Logo */}
        <Link to="/" className="font-bold text-xl flex gap-1 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" />
          </svg>
          MyHotels
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search hotels..."
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleSearchClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>

          {suggestionsOpen && suggestions.length > 0 && (
            <ul className="absolute z-50 top-full mt-1 w-full bg-white border rounded-md shadow-lg">
              {suggestions.map((hotel) => (
                <li
                  key={hotel.id}
                  onClick={() => handleSelect(hotel)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <span className="truncate">{hotel.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden sm:flex items-center gap-4">
          {user ? (
            <>
              {/* 🔹 MODIFIED: clickable profile link */}
              <Link to="/profile" className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50 inline-block">
                 Profile
               </Link>

              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 px-4 py-1 rounded-md hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Profile */}
        <div className="sm:hidden relative">
          <button onClick={() => setProfileOpen(!profileOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0"
                clipRule="evenodd" />
            </svg>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg">
              <ul className="text-center">
                {user ? (
                  <>
                    {/* 🔹 MODIFIED: clickable profile link */}
                    <Link to="/profile" className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50 inline-block">
                          Profile
                    </Link>

                    <li
                      onClick={handleLogout}
                      className="py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </li>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <li className="py-2 hover:bg-gray-100">Login</li>
                    </Link>
                    <Link to="/register">
                      <li className="py-2 hover:bg-gray-100">Register</li>
                    </Link>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
