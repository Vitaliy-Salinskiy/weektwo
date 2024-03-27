"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useSocketStore } from "@/store/socketStore";

interface TimeSlotProps {
  time: string;
  day: string;
  userId: string | undefined;
  isBookedBy: boolean;
  eventTitle?: string;
}

export const TimeSlot = ({
  time,
  day,
  userId,
  isBookedBy,
  eventTitle,
}: TimeSlotProps) => {
  const { socket } = useSocketStore();

  const [isBooked, setIsBooked] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [title, setTitle] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    setIsBooked(isBookedBy);
    setTitle(eventTitle || "");
  }, [isBookedBy, eventTitle]);

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

    socket?.on(
      "reservation confirmed",
      (bookedDay: string, bookedTime: string, bookedTitle: string) => {
        if (bookedDay === day && bookedTime === time) {
          setIsBooked(true);
          setTitle(bookedTitle);
        }
      }
    );
  }, [socket, day, time]);

  const handleBook = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (title.length > 0) {
      const response = await fetch("/api/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim(), day, time, userId }),
      });
      setIsBooking(false);
      const message = await response.json();
      if (response.status >= 200 && response.status < 300) {
        setIsBooked(true);
        socket?.emit("reservation", message.day, message.time, message.title);
      } else {
        setIsBooked(false);
        socket?.emit("cancel booking", day, time);
        toast({
          duration: 3500,
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: message.errors,
        });
      }
    } else {
      toast({
        duration: 3500,
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter an event title. To book a time slot.",
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
  };

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
        // disabled={isBooked}
        className="border-t h-14 w-full"
        onClick={() => {
          setIsBooking(true);
        }}
      >
        {(isBooked || isBooking) && (
          <div className="bg-black text-white h-14 w-full rounded-sm shadow-md drop-shadow-lg grid place-content-center">
            {title || "booking..."}
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
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          <Button onClick={handleBook} disabled={!userId}>
            Confirm
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
