"use client";

import { TimeSlot } from "@/components/shared/TimeSlot";
import { getDays } from "@/utils";
// import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function Home() {
  const calendarData = getDays();
  const hours = calendarData[0].times;
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <main className="flex">
      {/* <div className="mt-[95px] pl-5 pr-10">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div> */}
      <div className="flex flex-col pt-[95px] justify-between">
        {hours.map((hour, index) => (
          <div
            key={hour + index}
            className="flex items-center h-14 text-gray-500 text-sm px-1"
          >
            {hour}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 w-full">
        {calendarData.map((day, index) => {
          let [dayOfWeek, date] = day.date.split(" ");
          return (
            <div key={day.date + index} className={`border border-t-0`}>
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-5">
                <p className="text-sm">{date}</p>
                <h2 className="text-2xl">{dayOfWeek}</h2>
              </div>
              <div>
                {day.times.map((time, index) => (
                  <TimeSlot time={time} key={index + time} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
