import React from "react";
import HeroSection from "../Components/Sections/Home/HeroSection";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import DiscoverSection from "../Components/Sections/Home/DiscoverSection";
import FeatureSection from "../Components/Sections/Home/FeatureSection";
import HotelDescription from "./HotelDescription";
import hotelsData from "../data/hotelData";


const Home = () => {

  const selectedHotel = hotelsData[4];

  return (
     <>
      <HotelDescription hotel={selectedHotel} />
    </>
  );
};

export default Home;

{/* <div className="flex flex-col min-h-screen">
      <Navbar />
        <HeroSection />
        <FeatureSection />
        <DiscoverSection />
      <Footer />
    </div>*/}
     {/*<>
      <HotelDescription hotel={selectedHotel} />
    </>*/}