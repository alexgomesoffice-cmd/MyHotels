import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import HeroSection from "../Components/Sections/Home/HeroSection";
import HotelCardList from "../Components/UI/HotelCardList";

import { getHotels } from "../data/api";

const Hotels = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const locationParam = query.get("location");

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = locationParam
    ? hotels.filter(
        (hotel) =>
          hotel.location?.toLowerCase() === locationParam.toLowerCase()
      )
    : hotels;

      console.log(hotels);

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

        {loading && (
          <p className="text-center text-gray-500">Loading hotels...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && filteredHotels.length > 0 &&
          filteredHotels.map((hotel) => (
            <HotelCardList key={hotel.id} hotel={hotel} />
          ))}

        {!loading && !error && filteredHotels.length === 0 && (
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
