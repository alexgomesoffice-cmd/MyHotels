import { MapPinIcon, CalendarDaysIcon, UserIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  return (
    <section className="bg-blue-800 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-4xl md:text-6xl font-bold mb-4">LET'S TRAVEL!</h1>

        <p className="text-lg md:text-xl text-blue-200 mb-10">
          Helping You Find Your Dream Hotel
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 shadow-lg 
                        flex flex-col md:flex-row gap-3 items-center 
                        max-w-3xl w-full mx-auto">

          {/* Location */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 w-full">
            <MapPinIcon className="w-6 h-6 text-gray-500" />
            <input type="text"
              placeholder="Where are you going?"
              className="w-full focus:outline-none text-black"
            />
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 w-full">
            <CalendarDaysIcon className="w-6 h-6 text-gray-500" />
            <input type="text"
              placeholder="Check-in — Check-out"
              className="w-full focus:outline-none text-black"
            />
          </div>

          {/* Guests */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 w-full">
            <UserIcon className="w-6 h-6 text-gray-500" />
            <input type="text"
              placeholder="2 adults · 0 children · 1 room"
              className="w-full focus:outline-none text-black"
            />
          </div>

          {/* Button */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg w-full md:w-auto">
            Search
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
