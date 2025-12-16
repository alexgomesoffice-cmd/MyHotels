import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HotelCardList from "../Components/UI/HotelCardList";
import hotelsData from "../data/hotelData"; // <-- no curly braces


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Hotels = () => {
  const query = useQuery();
  const locationParam = query.get("location");

  const filteredHotels = locationParam
    ? hotelsData.filter((hotel) => hotel.location === locationParam)
    : hotelsData;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCardList key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hotels found for "{locationParam}"
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Hotels;
