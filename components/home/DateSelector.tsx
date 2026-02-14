"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  tripType: "round" | "oneWay";
  departure?: Date;
  returnDate?: Date;
  onDepartureChange: (date?: Date) => void;
  onReturnChange: (date?: Date) => void;
};

export function DateSelector({
  tripType,
  departure,
  returnDate,
  onDepartureChange,
  onReturnChange,
}: Props) {
  const isRoundTrip = tripType === "round";

  return (
    <div
      className={`grid gap-4 ${isRoundTrip ? "md:grid-cols-2" : "md:grid-cols-1"}`}
    >
      {/* Departure */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 justify-start rounded-xl text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {departure ? format(departure, "PPP") : "Select departure"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={departure}
            onSelect={onDepartureChange}
          />
        </PopoverContent>
      </Popover>

      {/* Return */}
      {isRoundTrip && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 justify-start rounded-xl text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? format(returnDate, "PPP") : "Select return"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={onReturnChange}
              disabled={(date) => (departure ? date < departure : false)}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
