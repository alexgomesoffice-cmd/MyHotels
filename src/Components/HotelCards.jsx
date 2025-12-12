import React from 'react';
import hotel from "../assets/Img/OIP.webp";

const HotelCards = () => {
  return (
    <div>
      <div className="w-96 shadow-none pl-10 pt-5 mb-0">
        <figure className="w-full h-96 bg-cover bg-center relative rounded-md border-none" 
                style={{ backgroundImage: `url(${hotel})` }}>

          <div className="absolute bottom-0 left-0 w-full text-white p-4 backdrop-blur-[1px] rounded-b-md" 
               style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
            <h2 className="text-xl font-semibold">Card Title</h2>
            <p className="text-sm">
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="flex justify-center items-center">
              <button className="bg-blue-700 px-4 py-2 rounded-md mt-2">Book Now</button>
            </div>
          </div>
        </figure>
      </div>
    </div>
  );
};

export default HotelCards;
