import React from "react";
import { useNavigate } from "react-router-dom";

import HeroSection from "../Components/Sections/Home/HeroSection";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import DiscoverSection from "../Components/Sections/Home/DiscoverSection";
import FeatureSection from "../Components/Sections/Home/FeatureSection";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <HeroSection />

      {/* Browse Hotels  */}
      <div className="flex justify-center py-12 bg-white">
        <button
          onClick={() => navigate("/hotels")}
          className="px-10 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Browse Hotels
        </button>
      </div>

      <FeatureSection />
      <DiscoverSection />

      <Footer />
    </div>
  );
};

export default Home;
