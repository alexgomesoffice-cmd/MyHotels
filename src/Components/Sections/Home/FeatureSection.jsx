import React from "react";
import Slider from "react-slick";
import HotelCard from "../../HotelCards";
import hotel from "../../../assets/Img/OIP.webp";

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
  const data = [
    { image: hotel, title: "Hotel A" },
    { image: hotel, title: "Hotel B" },
    { image: hotel, title: "Hotel C" },
    { image: hotel, title: "Hotel D" },
    { image: hotel, title: "Hotel E" },
    { image: hotel, title: "Hotel F" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false,
    fade: false,
    slidesToShow: 3,
    slidesToScroll: 3,
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

  return (
    <div className="py-10 relative">
      <div className="max-w-[1200px] mx-auto px-6 relative">
        <h1 className="text-2xl font-bold mb-5">Featured Hotels</h1>
        <Slider {...settings}>
          {data.map((item, index) => (
            <div key={index} className="px-3">
              <HotelCard image={item.image} title={item.title} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FeatureSection;