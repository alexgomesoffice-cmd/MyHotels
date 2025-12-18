import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import HeroSection from "../Components/Sections/Home/HeroSection"
import Footer from "../Components/Footer/Footer";
const HotelDescription = ({ hotel }) => {
  return (
    <>
      <Navbar />
      <HeroSection/>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full max-h-[400px] object-cover rounded-lg shadow-md"
        />

        <div className="mt-6 space-y-3">
            <div className="flex justify-between">
                <h2 className="text-3xl font-bold text-gray-800">
                     {hotel.name}
                 </h2>
                 <button className="ml-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                 Book Now
                 </button>
            </div>
          

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Location:</span>{hotel.location}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Rating:</span>{hotel.rating}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold text-gray-800">Price:</span> ${hotel.price} / night
          </p>

          <p className="text-gray-700 leading-relaxed">
            {hotel.description}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelDescription;
