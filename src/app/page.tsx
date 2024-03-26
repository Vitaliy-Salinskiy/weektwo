"use client";

import { signIn, useSession } from "next-auth/react";

import { TimeSlot } from "@/components/shared/TimeSlot";
import { setupSocket } from "@/store/socketStore";
import { getDays } from "@/utils";
import { useEffect } from "react";

export default function Home() {
  const calendarData = getDays();
  const hours = calendarData[0].times;

  const { data: _session, status } = useSession();

  useEffect(() => {
    const cleanup = setupSocket();
    return cleanup;
  }, []);

  if (status === "loading")
    return <div className="text-2xl text-bold">Loading...</div>;

  return (
    <main className="flex">
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
            <div key={day.date + index} className={`border-x`}>
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-5">
                <p className="text-sm" onClick={() => signIn("github")}>
                  {date}
                </p>
                <h2 className="text-2xl">{dayOfWeek}</h2>
              </div>
              <div>
                {day.times.map((time, index) => (
                  <TimeSlot day={day.date} time={time} key={index + time} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
