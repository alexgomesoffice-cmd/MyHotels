import React from "react";
import HeroSection from "../Components/Sections/Home/HeroSection";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import DiscoverSection from "../Components/Sections/Home/DiscoverSection";
import FeatureSection from "../Components/Sections/Home/FeatureSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <DiscoverSection />
      <Footer />
    </div>
  );
};

export default Home;
