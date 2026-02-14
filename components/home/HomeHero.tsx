"use client";

import FlightSearch from "./FlightSearch";

type Props = {};

const HomeHero = (props: Props) => {
  return (
    <section className="bg-linear-to-b from-blue-100 to-white py-20 w-full min-h-screen">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Search Flights <span className="text-blue-600">Worldwide</span>
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Find the best deals on 500+ airlines across the globe with our
          real-time comparison engine.
        </p>

        <div className="mt-12">
          <FlightSearch />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
