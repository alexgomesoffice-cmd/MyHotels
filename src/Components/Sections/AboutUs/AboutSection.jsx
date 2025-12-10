import React from 'react';
const AboutSection = () => {
  return (
     <section className="bg-blue-700 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">

        <h2 className="text-3xl font-bold">About Us</h2>

        <p className="text-lg leading-relaxed">
          MyHotels is designed to make hotel booking simple, fast, and reliable. 
          We offer a wide selection of stays—from budget rooms to premium hotels—
          so you can compare options and book with confidence.
        </p>

        <p className="text-lg leading-relaxed">
          Our mission is to create a smooth and stress-free experience through 
          clear pricing, verified listings, and a platform that’s easy to use.
        </p>

        <p className="text-lg leading-relaxed">
          Your comfort starts with choosing the right place, and we're here to 
          help you discover the stay that fits your journey.
        </p>

      </div>
    </section>
  );
}

export default  AboutSection