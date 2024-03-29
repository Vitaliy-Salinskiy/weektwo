"use client";

import { useSetupSocket } from "@/hooks";
import { getDays } from "@/utils";
import { TimeSlot } from "./TimeSlot";
import { useSession } from "next-auth/react";
import { ExtendedSlot } from "@/interfaces";

interface BigCalendarProps {
  slots: Partial<ExtendedSlot[]>;
}

const BigCalendar = ({ slots }: BigCalendarProps) => {
  const { data: session } = useSession();

  const calendarData = getDays();
  const hours = calendarData[0].times;

  useSetupSocket();

  return (
    <>
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
          const [dayOfWeek, date] = day.date.split(" ");
          return (
            <div key={day.date + index} className={`border-x`}>
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-5">
                <p className="text-sm">{date}</p>
                <h2 className="text-2xl">{dayOfWeek}</h2>
              </div>
              <div>
                {day.times.map((time, index) => {
                  const matchingSlot = slots.find(
                    (slot) => slot?.time === time && slot?.day === day.date
                  );

                  return (
                    <TimeSlot
                      day={day.date}
                      time={time}
                      session={session}
                      key={index + time}
                      isBookedBy={!!matchingSlot}
                      slot={matchingSlot}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BigCalendar;
