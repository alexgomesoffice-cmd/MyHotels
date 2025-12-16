import React from "react";

const HotelCardList = ({ hotel }) => {
  return (
    <div
      className="
        flex flex-col md:flex-row
        border border-gray-300/60 rounded-xl
        overflow-hidden
        shadow-sm hover:shadow-md transition-shadow duration-300
        mb-6
      "
    >
      {/* Hotel Image */}
      <div className="w-full md:w-48 h-40 md:h-36 flex items-center justify-center p-4">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="max-w-full max-h-full object-cover rounded-lg"
        />
      </div>

      {/* Hotel Info + Price */}
      <div className="flex flex-col md:flex-row justify-between flex-1 p-4">
        {/* Hotel Info */}
        <div className="flex-1">
          <h2 className="text-lg font-bold">{hotel.name}</h2>
          <p className="text-gray-500 text-sm">{hotel.location}</p>
          <p className="text-gray-700 mt-2 text-sm">{hotel.description}</p>
        </div>

        {/* Price and Book Button */}
        <div className="flex flex-col items-end justify-between mt-4 md:mt-0 md:ml-4">
          <p className="text-xl md:text-2xl font-bold">
            ${hotel.price}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-2 md:mt-4">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCardList;
