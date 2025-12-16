import React from "react";
import Navbar from "../Components/Navbar/Navbar";

const Login = () => {
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
          <form className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input type="email" className="w-full mt-1 px-4 py-2 border rounded-md " />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input type="password" className="w-full mt-1 px-4 py-2 border rounded-md "/>
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
