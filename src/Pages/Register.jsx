import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import api from "../data/api"; // {message part} backend connection

const Register = () => {
  const navigate = useNavigate();

  // {message part} form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [roleId, setRoleId] = useState(2); 

  // {message part} submit handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        roleId,
      });

      // {message part} redirect after success
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <section className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
        <div className="bg-white w-full max-w-md p-8 shadow-lg rounded">
          <h2 className="text-2xl font-bold text-center bg-blue-700 text-white py-2 rounded">
            Create an Account
          </h2>

          <p className="text-center text-gray-500 mt-4">
            Join MyHotels and start booking today
          </p>

          {error && (
            <p className="text-red-600 text-sm text-center mt-4">
              {error}
            </p>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleRegister}>
            <div>
              <div className="mb-3 flex justify-center">
                <label className="form-label">Register as : </label>
                <select
                  className="form-select text-center"
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  required
                >
                  <option value={2}>User</option>
                  <option value={3}>Hotel Manager</option>
                  {/*<option value={1}>Admin</option>*/}
                </select>
              </div>

              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                className="w-full mt-1 px-4 py-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                className="w-full mt-1 px-4 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                className="w-full mt-1 px-4 py-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800">
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 font-semibold">
              Login
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default Register;
