import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import hotelsData from "../data/hotelData";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const HotelDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const hotel = hotelsData.find(
    (hotel) => hotel.id === parseInt(id)
  );

  if (!hotel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Hotel not found</h2>
        <button
          onClick={() => navigate("/hotels")}
          className="mt-4 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-1">
        
        {/* Image */}
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-[260px] sm:h-[360px] md:h-[440px] object-cover rounded-3xl mb-10"
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-6 flex-nowrap">
          
          {/* Title + Info */}
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              {hotel.name}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              {hotel.location}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              ★ {hotel.rating}
            </p>
          </div>

          {/* Price + Button */}
          <div className="flex items-center gap-5 shrink-0 whitespace-nowrap">
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                ${hotel.price}
              </p>
              <p className="text-xs text-gray-500 -mt-1">
                per night
              </p>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium cursor-pointer">
              Confirm Booking
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-10 max-w-3xl text-gray-600 leading-relaxed">
          {hotel.description}
        </p>

      </main>

      <Footer />
    </div>
  );
};

export default HotelDescription;
