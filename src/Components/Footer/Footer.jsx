import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-10 mt-10">

      <div className="max-w-6xl mx-auto 
        flex flex-col md:flex-row justify-center md:justify-between 
        items-center md:items-start 
        gap-10 md:gap-0">

        {/* About Us */}
        <div className="w-full md:w-1/3 px-4">
          <h3 className="font-semibold text-lg 
              hover:text-blue-700 cursor-pointer inline-block">
            About Us
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Learn more about our mission and values.
          </p>
        </div>

        {/* Terms of Services */}
        <div className="w-full md:w-1/3 px-4">
          <h3 className="font-semibold text-lg 
              hover:text-blue-700 cursor-pointer inline-block">
            Terms of Services
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Understand our policies and service guidelines.
          </p>
        </div>

        {/* Customer Service Help */}
        <div className="w-full md:w-1/3 px-4">
          <h3 className="font-semibold text-lg 
              hover:text-blue-700 cursor-pointer inline-block">
            Customer Service Help
          </h3>
          <p className="text-gray-400 text-sm mt-2">
            Need support? We're here for you 24/7.
          </p>
        </div>

      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-gray-400 text-sm">
        © {new Date().getFullYear()} MyHotels — All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
