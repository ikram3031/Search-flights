"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import {
  ArrowLeftRight,
  ArrowRightLeft,
  ArrowRightToLine,
  CalendarIcon,
  TicketsPlane,
} from "lucide-react";

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

  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSwap = () => {
    if (!from && !to) return;

    setFrom(to);
    setTo(from);
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

        <div className="relative">
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
        </div>
      </div>
    </Card>
  );
};

export default FlightSearch;
