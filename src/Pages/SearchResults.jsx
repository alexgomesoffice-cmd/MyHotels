import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HotelCardList from "../Components/UI/HotelCardList";
import { fetchAllHotels } from "../data/api";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const data = await fetchAllHotels();
        setHotels(data);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10 flex-1">
        <h2 className="text-2xl font-bold mb-6">
          Search Results for "{searchTerm}"
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCardList key={hotel.hotel_id} hotel={hotel} />
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
