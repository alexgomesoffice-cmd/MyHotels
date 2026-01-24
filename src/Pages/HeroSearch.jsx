import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HeroSection from "../Components/Sections/Home/HeroSection";
import HotelCardList from "../Components/UI/HotelCardList";

const HeroSearch = () => {
  const { state } = useLocation();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state || !state.searchResults) {
      setError("No search results found");
      setLoading(false);
      return;
    }

    // ADAPT BACKEND DATA → UI FORMAT
    const mappedHotels = state.searchResults.map((hotel) => ({
      id: hotel.hotel_id,
      name: hotel.hotel_name,
      location: hotel.address,
      description: hotel.description,
      price: hotel.starting_price,
      availableRooms: hotel.available_rooms,
      image: hotel.image, 
    }));

    console.log("Mapped Hotels:", mappedHotels);
    console.log("Search Results from Backend:", state.searchResults);

    setHotels(mappedHotels);
    setLoading(false);
  }, [state]);
  return (
    <>
      <Navbar />
      <HeroSection />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">
          Search Results
        </h1>

        {loading && (
          <p className="text-center text-gray-500">
            Searching available hotels...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && hotels.length > 0 &&
          hotels.map((hotel) => (
            <HotelCardList
              key={hotel.id}
              hotel={hotel}
            />
          ))}

        {!loading && !error && hotels.length === 0 && (
          <p className="text-center text-gray-500 mt-20">
            No hotels available for the selected dates and location
          </p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default HeroSearch;
