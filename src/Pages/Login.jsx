import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import api from "../data/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      // store token
      localStorage.setItem("token", response.data.token);

      // store ONLY user object
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      // 🔥 notify Navbar immediately
      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <>
      <Navbar />

      <section className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
        <div className="bg-white w-full max-w-md p-8 shadow-lg rounded">
          <h2 className="text-2xl font-bold text-center bg-blue-700 text-white py-2 rounded">
            Login to MyHotels
          </h2>

          <p className="text-center text-gray-500 mt-4">
            Welcome back! Please login to your account
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mt-3">
              {error}
            </p>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-md"
                required
              />
            </div>

            <button className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-700 font-semibold">
              Register
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default Login;
