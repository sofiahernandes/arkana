// Calendar popup used to filter or pick dates in contribution-related flows.
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CalendarPopover() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="justify-between font-normal"
        >
          {date ? date.toLocaleDateString() : "Selecione a data"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id="calendar"
        className="w-auto overflow-hidden border-[#ccc] p-0"
        align="start"
      >
        <Calendar
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(date) => {
            setDate(date);
            setCalendarOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
