import React from 'react';

const TermsAndServicesSection = () => {
  return (
    <section className="bg-blue-700 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">

        <h2 className="text-3xl font-bold">Terms & Services</h2>

        <p className="text-lg leading-relaxed">
          By using MyHotels, you agree to comply with and be bound by the terms
          and conditions outlined here. These terms govern your access to and
          use of our platform and services.
        </p>

        <p className="text-lg leading-relaxed">
          All bookings are subject to availability and confirmation by the hotel.
          Prices, offers, and availability may change without prior notice.
          MyHotels acts as a booking platform and is not responsible for
          hotel-specific policies or changes.
        </p>

        <p className="text-lg leading-relaxed">
          Users are responsible for providing accurate information during
          booking. Any misuse, fraudulent activity, or violation of these
          terms may result in restricted access or account termination.
        </p>

        <p className="text-lg leading-relaxed">
          We reserve the right to update these terms at any time to improve
          our services or comply with legal requirements. Continued use of
          MyHotels means you accept any changes made.
        </p>

      </div>
    </section>
  );
};

export default TermsAndServicesSection;
