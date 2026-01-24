import React from "react";
import { useNavigate } from "react-router-dom";

const HotelCardList = ({ hotel }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hotels/${hotel.hotel_id ?? hotel.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col md:flex-row border border-gray-300/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 cursor-pointer bg-white"
    >
      <div className="w-full md:w-48 h-48 md:h-auto">
        <img
  src={
    hotel.image
      ? `http://localhost:5000/${hotel.image.replace(/\\/g, "/")}`
      : "/assets/Img/hotel.jpg"
  }
  alt={hotel.name ?? "Hotel image"}
  className="w-full h-full object-cover"
/>

      </div>

      <div className="flex flex-col md:flex-row justify-between flex-1 p-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold">
            {hotel.name ?? "Unnamed Hotel"}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {hotel.address ?? hotel.location}
          </p>

          <p className="text-gray-700 mt-2 text-sm line-clamp-3">
            {hotel.description ?? "No description provided by the manager."}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between mt-4 md:mt-0 md:ml-4">
          <p className="text-xl md:text-2xl font-bold">
 TK {hotel.price_per_night ?? hotel.price ?? hotel.room_price ?? "—"}          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-2 md:mt-4"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCardList;
