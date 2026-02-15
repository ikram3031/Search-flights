"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  ArrowRightToLine,
  CalendarIcon,
  TicketsPlane,
} from "lucide-react";
import { DateSelector } from "./DateSelector";
import { Button } from "../ui/button";
import { format } from "date-fns";
import { toast } from "sonner";

type Airport = {
  code: string;
  city: string;
};

const airports: Airport[] = [
  { code: "DAC", city: "Dhaka" },
  { code: "DXB", city: "Dubai" },
  { code: "KUL", city: "Kuala Lumpur" },
  { code: "LHR", city: "London" },
];

type Props = {};

const FlightSearch = (props: Props) => {
  let [tripType, setTripType] = useState<"round" | "oneWay">("round");
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);

  const [departure, setDeparture] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleSwap = () => {
    if (!from && !to) return;

    setFrom(to);
    setTo(from);
  };

  const router = useRouter();

  const handleSearch = () => {
    // Basic validation
    if (!from || !to || !departure) {
      // alert("Please select From, To and Departure date");
      toast.error("Please select From, To and Departure date");
      return;
    }

    if (tripType === "round" && !returnDate) {
      // alert("Please select Return date");
      toast.error("Please select Return date");
      return;
    }

    const query = new URLSearchParams({
      tripType,
      from: from.code,
      to: to.code,
      departure: format(departure, "yyyy-MM-dd"),
      ...(tripType === "round" && returnDate
        ? { returnDate: format(returnDate, "yyyy-MM-dd") }
        : {}),
    }).toString();

    router.push(`/search-flights?${query}`);
  };

  return (
    <Card className="mx-auto w-6xl rounded-2xl shadow p-8">
      {/* Trip Type */}
      <div className="flex gap-2 mb-8 text-sm">
        <button
          onClick={() => setTripType("round")}
          className={`${tripType === "round" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} py-2 px-2 rounded-lg w-28 flex items-center gap-1 justify-center`}
        >
          <TicketsPlane size={16} />
          Round Trip
        </button>
        <button
          onClick={() => setTripType("oneWay")}
          className={`${tripType === "oneWay" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"} py-2 px-2 rounded-lg w-28 flex items-center gap-1 justify-center`}
        >
          <ArrowRightToLine size={16} />
          One Way
        </button>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center gap-4">
        <select
          value={from?.code || ""}
          onChange={(e) =>
            setFrom(airports.find((a) => a.code === e.target.value) || null)
          }
          className="h-12 rounded-xl border px-4"
        >
          <option value="">From</option>
          {airports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </select>

        <button
          onClick={handleSwap}
          disabled={!from || !to}
          className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-gray-100 disabled:opacity-40"
        >
          <ArrowRightLeft size={18} />
        </button>

        <select
          value={to?.code || ""}
          onChange={(e) =>
            setTo(airports.find((a) => a.code === e.target.value) || null)
          }
          className="h-12 rounded-xl border px-4"
        >
          <option value="">To</option>
          {airports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </select>
        <DateSelector
          tripType={tripType}
          departure={departure}
          returnDate={returnDate}
          onDepartureChange={(date) => setDeparture(date)}
          onReturnChange={(date) => setReturnDate(date)}
        />

        {/* <div className="relative">
          <input
            type="date"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="h-12 w-full rounded-xl border px-4"
          />
          <CalendarIcon
            size={16}
            className="absolute right-3 top-3 text-gray-400"
          />
        </div> */}
      </div>
      {/* bottom */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex gap-6 text-sm text-gray-500">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Direct Flights Only
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Nearby Airports
          </label>
        </div>

        <Button
          onClick={handleSearch}
          className="h-12 rounded-xl px-8 text-base"
        >
          Search Flights
        </Button>
      </div>
    </Card>
  );
};

export default FlightSearch;
