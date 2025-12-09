import React from 'react'
import Button from './UI/Button'

const HotelCards = () => {
  return (
    <div>
      <div className="w-96 shadow-sm pl-10 pt-5">
        
        <figure className="w-full h-96 bg-gray-300 relative rounded-md">

          <div className="absolute bottom-0 left-0 w-full text-white p-3">
            <h2>Card Title</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="flex justify-center align-center">
              <button className="bg-blue-700 px-4 py-1 rounded-md mt-2">Book Now</button>
            </div>
          </div>

        </figure>

      </div>
    </div>
  );
};

export default HotelCards;



