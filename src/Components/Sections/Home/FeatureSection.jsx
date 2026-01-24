import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import HotelCard from "../../HotelCards";
import { fetchAllHotels } from "../../../data/api";
import defaultHotel from "../../../assets/Img/OIP.webp";

const NextArrow = ({ onClick }) => (
  <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 cursor-pointer text-3xl select-none px-3"
    onClick={onClick}>
    {">"}
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 cursor-pointer text-3xl select-none px-3"
    onClick={onClick} >
    {"<"}
  </div>
);

const FeatureSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const hotels = await fetchAllHotels();
        const shuffled = hotels.sort(() => Math.random() - 0.5).slice(0, 6);
        const mappedData = shuffled.map((hotel) => ({
          id: hotel.hotel_id,
          image: hotel.images && hotel.images.length > 0 
            ? `http://localhost:5000/${hotel.images[0].image_url.replace(/\\/g, "/")}` 
            : defaultHotel,
          title: hotel.name,
        }));
        setData(mappedData);
      } catch (error) {
        console.error("Error loading featured hotels:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    fade: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    initialSlide: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
    ],
  };

  if (loading) {
    return <div className="py-10 text-center">Loading Featured Hotels...</div>;
  }

  if (data.length === 0) {
    return <div className="py-10 text-center">No hotels available</div>;
  }

  return (
    <div className="py-10 relative">
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <h1 className="text-2xl font-bold mb-5">Featured Hotels</h1>
        <Slider {...settings}>
          {data.map((item) => (
            <div key={item.id} className="px-3">
              <HotelCard image={item.image} title={item.title} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FeatureSection;