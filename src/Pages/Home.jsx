import React from 'react'
import HeroSection from '../Components/Sections/Home/HeroSection'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import DiscoverSection from '../Components/Sections/Home/DiscoverSection'
import FeatureSection from '../Components/Sections/Home/FeatureSection'
const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <DiscoverSection />
      <Footer />
    </>
  )
}

export default Home