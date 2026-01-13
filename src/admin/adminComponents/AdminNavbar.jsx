import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
    const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // force auth-aware components to update
    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-md px-5 py-4 flex items-center justify-between">
      <h1 className="font-bold text-xl text-blue-600">
        Admin Panel
      </h1>

      <div className="flex items-center gap-4">
        <Link
  to="/profile"
  className="border border-blue-600 text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50 inline-block"
>
  Profile
</Link>
        <button onClick={handleLogout}
        className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
