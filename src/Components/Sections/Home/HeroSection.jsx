import React, { useState, useRef, useEffect } from "react";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

const destinations = [
  "Dhaka",
  "Chittagong",
  "Khulna",
  "Barisal",
  "Sylhet",
  "Rajshahi",
  "Rangpur",
];

const HeroSection = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState(destinations[0]);
  const [locationOpen, setLocationOpen] = useState(false);

  const [person, setPerson] = useState(2);
  const [rooms, setRooms] = useState(1);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const calendarRef = useRef(null);
  const guestRef = useRef(null);
  const locationRef = useRef(null);

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(e.target)) {
        setGuestOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    navigate(
      `/hotels?location=${location}&checkIn=${format(
        dateRange[0].startDate,
        "yyyy-MM-dd"
      )}&checkOut=${format(
        dateRange[0].endDate,
        "yyyy-MM-dd"
      )}&person=${person}&rooms=${rooms}`
    );
  };

  return (
    <section className="bg-blue-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          LET'S TRAVEL!
        </h1>
        <p className="text-blue-200 mb-10 text-lg">
          Helping You Find Your Dream Hotel
        </p>

        <div className="bg-white rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center">

          {/* DESTINATION (CUSTOM DROPDOWN) */}
          <div
            ref={locationRef}
            onClick={() => setLocationOpen(true)}
            className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 cursor-pointer"
          >
            <MapPinIcon className="w-6 h-6 text-gray-500" />
            <span className="text-black flex-1 text-left">
              {location}
            </span>

            {locationOpen && (
              <div
                className="absolute top-full mt-2 z-50 bg-white text-black rounded-xl p-2 w-full border border-gray-200 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {destinations.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setLocation(city);
                      setLocationOpen(false);
                    }}
                    className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE RANGE (UNCHANGED) */}
          <div
  ref={calendarRef}
  onClick={() => setCalendarOpen(true)}
  className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 cursor-pointer"
>
  <CalendarDaysIcon className="w-6 h-6 text-gray-500" />
  <span className="text-black text-left">
    {`${format(dateRange[0].startDate, "MMM dd")} — ${format(
      dateRange[0].endDate,
      "MMM dd"
    )}`}
  </span>

  {calendarOpen && (
    <div
      className="
        absolute top-full mt-2 z-50 bg-white rounded-2xl overflow-hidden
        left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0
        border border-gray-200
        [&_.rdrCalendarWrapper]:rounded-2xl
        [&_.rdrCalendarWrapper]:overflow-hidden
        [&_.rdrMonths]:justify-center
        [&_.rdrMonth]:w-full
        [&_.rdrYearPicker]:hidden
      "
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <DateRange
        editableDateInputs={false}
        showDateDisplay={false}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
        minDate={new Date()}
        rangeColors={["#2563EB"]}
        months={1}
        direction="horizontal"
        onChange={(item) => setDateRange([item.selection])}
      />
    </div>
  )}
</div>

          {/* GUESTS*/}
          <div
            ref={guestRef}
            onClick={() => setGuestOpen(true)}
            className="relative flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 flex-1 cursor-pointer"
          >
            <UserIcon className="w-6 h-6 text-gray-500" />
            <span className="text-black">
              {person} adults · {rooms} room
            </span>

            {guestOpen && (
              <div
                className="absolute top-full mt-2 z-50 bg-white text-black rounded-xl p-4 w-full cursor-default border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Adults */}
                <div className="flex justify-between items-center mb-4">
                  <span>Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setPerson(clamp(person - 1, 1, 20))
                      }
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      −
                    </button>
                    <span>{person}</span>
                    <button
                      onClick={() =>
                        setPerson(clamp(person + 1, 1, 20))
                      }
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="flex justify-between items-center">
                  <span>Rooms</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setRooms(clamp(rooms - 1, 1, 20))
                      }
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      −
                    </button>
                    <span>{rooms}</span>
                    <button
                      onClick={() =>
                        setRooms(clamp(rooms + 1, 1, 20))
                      }
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg w-full md:w-auto"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
