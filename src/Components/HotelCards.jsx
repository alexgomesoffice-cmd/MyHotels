import React from "react";

const HotelCard = ({ image, title }) => {
  return (
    <div className="w-full max-w-sm mx-auto pt-5">
      <figure
        className="w-full h-80 sm:h-96 bg-cover bg-center relative rounded-md"
        style={{ backgroundImage: `url(${image})` }}>
        <div
          className="absolute bottom-0 left-0 w-full text-white p-4 backdrop-blur-[1px] rounded-b-md"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm">
            A card component has a figure, a body part, and inside body there are title and actions parts
          </p>
          <div className="flex justify-center">
            <button className="bg-blue-700 px-4 py-2 rounded-md mt-2">
              Book Now
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default HotelCard;
