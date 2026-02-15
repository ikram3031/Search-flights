"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";

type FlightCard = {
  id: string;
  flightKey: string;
  airline: string;
  airlineCode: string;
  price: number;
  currency: string;
  stops: number;
  duration: string;
  outbound: {
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    date: string;
  };
  inbound?: {
    from: string;
    to: string;
    depTime: string;
    arrTime: string;
    date: string;
  };
};

const CHUNK_SIZE = 20;

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
    <div className="p-4 space-y-4">
      {/* {displayed.map((flight) => (
        <div key={flight.id} className="border p-4 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">
                {flight.outbound.from} → {flight.outbound.to}
              </h3>
              <p>
                {flight.outbound.depTime} - {flight.outbound.arrTime}
              </p>
              <p>{flight.airline}</p>
              <p>{flight.stops === 0 ? "Non-Stop" : `${flight.stops} Stop`}</p>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold">
                {flight.currency} {flight.price}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
                Select
              </button>
            </div>
          </div>
        </div>
      ))} */}

      {/* Observer Element */}
      <div ref={observerRef} className="h-10" />

      {loading && <p>Loading flights...</p>}
    </div>
  );
}
