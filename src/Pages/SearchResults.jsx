import React from "react";
import { useLocation } from "react-router-dom";
import HotelCardList from "../Components/UI/HotelCardList";
import hotelsData from "../data/hotelData";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HeroSection from "../Components/Sections/Home/HeroSection";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  // Filter hotels by name
  const filteredHotels = hotelsData.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 flex-1">
        <h2 className="text-2xl font-bold mb-6">
          Search Results for "{searchTerm}"
        </h2>

        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCardList key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No hotels found matching "{searchTerm}"
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
