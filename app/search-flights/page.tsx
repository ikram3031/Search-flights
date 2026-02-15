"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { formatTime } from "@/utils/formatTime";

type FlightCard = {
  id: string;
  flightKey: string;
  airline: string;
  airlineCode: string;
  price: number;
  currency: string;
  duration: string;
  inStops: number;
  outStops: number;
  outbound: {
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    depDate: string;
    arrDate: string;
    depAirport: string;
    arrAirport: string;
  };
  inbound?: {
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    depDate: string;
    arrDate: string;
    depAirport: string;
    arrAirport: string;
  };
};

const CHUNK_SIZE = 10;

export default function Page() {
  const searchParams = useSearchParams();

  const tripType = searchParams.get("tripType");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const departure = searchParams.get("departure");
  const returnDate = searchParams.get("returnDate");

  const [allResults, setAllResults] = useState<FlightCard[]>([]);
  const [displayed, setDisplayed] = useState<FlightCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            OriginDestinationOptions: [
              {
                DepartureAirport: from,
                ArrivalAirport: to,
                FlyDate: departure,
              },
              ...(tripType === "round"
                ? [
                    {
                      DepartureAirport: to,
                      ArrivalAirport: from,
                      FlyDate: returnDate,
                    },
                  ]
                : []),
            ],
            Passengers: [
              {
                PassengerType: "ADT",
                Quantity: 1,
              },
            ],
            CabinClass: "Economy",
          }),
        });

        const data = await res.json();

        setAllResults(data.results || []);
        setTotalResults(data.totalResults || 0);
        setDisplayed(data?.results?.slice(0, CHUNK_SIZE));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flights:", error);
        toast.error("Failed to fetch flights. Please try again.");
        setLoading(false);
      }
    };

    fetchFlights();
  }, [tripType, from, to, departure, returnDate]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const nextItems = allResults.slice(0, nextPage * CHUNK_SIZE);

    setDisplayed(nextItems);
    setPage(nextPage);
  }, [page, allResults]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayed.length < allResults.length) {
          loadMore();
        }
      },
      { threshold: 1 },
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [displayed, allResults, loadMore]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4 space-y-4 mx-auto max-w-4xl">
        {loading === false && (
          <h1 className="text-2xl font-bold">
            {totalResults} available flights
          </h1>
        )}

        {displayed.map((flight) => (
          <div
            key={flight.id}
            className="border p-4 rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-4">
                {/* OUTBOUND */}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <div className="">
                    <h3 className="font-bold text-lg">
                      {flight.outbound.from} → {flight.outbound.to}
                    </h3>
                    <p className="text-sm font-semibold text-gray-800">
                      {flight.airline}
                    </p>
                    <p className="text-gray-500 font-bold text-xs">
                      {flight.duration}
                    </p>
                  </div>
                  <div className="">
                    <p className="text-lg font-bold">
                      {formatTime(flight.outbound.depTime)}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {flight.outbound.depDate}
                    </p>
                    <p className="text-gray-500 font-bold text-xs ">
                      {flight.outbound.depAirport}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {formatTime(flight.outbound.arrTime)}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {flight.outbound.arrDate}
                    </p>
                    <p className="text-gray-500 font-bold text-xs">
                      {flight.outbound.arrAirport}
                    </p>
                  </div>
                  <div>
                    <p className="text-base font-bold">
                      {flight.outStops === 0
                        ? "Non-Stop"
                        : `${flight.outStops} Stop${flight.outStops > 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                {/* inbound */}
                {tripType === "round" ? (
                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 border-t border-gray-300 pt-4">
                    <div className="">
                      <h3 className="font-bold text-lg">
                        {flight.inbound?.from} → {flight.inbound?.to}
                      </h3>
                      <p className="text-sm font-semibold text-gray-800">
                        {flight.airline}
                      </p>
                      <p className="text-gray-500 font-bold text-xs">
                        {flight.duration}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-lg font-bold">
                        {formatTime(flight.inbound?.depTime)}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {flight.inbound?.depDate}
                      </p>
                      <p className="text-gray-500 font-bold text-xs ">
                        {flight.inbound?.depAirport}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {formatTime(flight.inbound?.arrTime)}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {flight.inbound?.arrDate}
                      </p>
                      <p className="text-gray-500 font-bold text-xs">
                        {flight.inbound?.arrAirport}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-bold">
                        {flight.outStops === 0
                          ? "Non-Stop"
                          : `${flight.outStops} Stop${flight.outStops > 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="text-right w-[20%] ">
                <p className="text-xl font-bold">
                  {flight.currency} {flight.price}
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Observer Element */}
        <div ref={observerRef} className="h-10" />

        {loading && (
          <p className="text-center font-bold text-2xl">
            Searching for available flights...
          </p>
        )}
      </div>
    </div>
  );
}
