"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { use, useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSocketStore } from "@/store/socketStore";

interface TimeSlotProps {
  time: string;
  day: string;
}

export const TimeSlot = ({ time, day }: TimeSlotProps) => {
  const { socket } = useSocketStore();

  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [event, setEvent] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    socket?.on("booking confirmed", (bookedDay: string, bookedTime: string) => {
      if (day === bookedDay && time === bookedTime) {
        setIsBooked(true);
      }
    });

    socket?.on("booking cancelled", (bookedDay: string, bookedTime: string) => {
      if (day === bookedDay && time === bookedTime) {
        setIsBooked(false);
      }
    });
  }, [socket, day, time]);

  const handleBooking = (isOpen: boolean) => {
    if (isOpen) {
      socket?.emit("booking", day, time);
    }
    if (!isOpen) {
      setIsBooking(false);
      socket?.emit("cancel booking", day, time);
    }
    if (isBooked) {
      setIsBooking(false);
    }
  };

  return (
    <Popover open={isBooking} onOpenChange={handleBooking}>
      <PopoverTrigger
        className="border-t h-14 w-full"
        onClick={() => {
          setIsBooking(true);
        }}
      >
        {(isBooked || isBooking) && (
          <div className="bg-black text-white h-full w-full inset-0 rounded-sm shadow-md drop-shadow-lg flex justify-center items-center">
            {event || "booking..."}
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent
        side="left"
        className="flex flex-col gap-5 w-[500px] shadow-2xl drop-shadow-2xl"
      >
        <form className="flex gap-3">
          <Input
            className="focus-visible::ring-0 focus-visible:ring-offset-0 text-lg"
            value={event}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEvent(e.target.value)
            }
          />
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              if (event.length > 0) {
                setIsBooking(false);
                setIsBooked(true);
              } else {
                toast({
                  duration: 3500,
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description:
                    "Please enter an event name. To book a time slot.",
                  action: (
                    <ToastAction
                      altText="Dismiss"
                      onClick={() => {
                        socket?.emit("cancel booking", day, time);
                        setIsBooking(false);
                      }}
                    >
                      Dismiss
                    </ToastAction>
                  ),
                });
              }
            }}
          >
            Confirm
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
