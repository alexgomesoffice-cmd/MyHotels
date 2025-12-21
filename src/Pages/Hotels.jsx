import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HotelCardList from "../Components/UI/HotelCardList";
import hotelsData from "../data/hotelData";
import HeroSection from "../Components/Sections/Home/HeroSection";

const Hotels = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const locationParam = query.get("location");

  const filteredHotels = locationParam
    ? hotelsData.filter(
        (hotel) =>
          hotel.location.toLowerCase() === locationParam.toLowerCase()
      )
    : hotelsData;

  return (
    <>
      <Navbar />
      <HeroSection />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">
          {locationParam
            ? `Hotels in ${locationParam}`
            : "All Available Hotels"}
        </h1>

        {/* Hotel List */}
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCardList key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-20">
            No hotels found for "{locationParam}"
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Hotels;
