"use client";

import { useEffect, useState } from "react";
import { useSocketStore } from "@/store/socketStore";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "next-auth";

import { IoCalendarNumber } from "react-icons/io5";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToastAction } from "@/components/ui/toast";

import { ExtendedSlot, SessionUser } from "@/interfaces";

interface TimeSlotProps {
  time: string;
  day: string;
  session: Session | null;
  isBookedBy: boolean;
  slot?: Partial<ExtendedSlot>;
}

export const TimeSlot = ({
  time,
  day,
  session,
  isBookedBy,
  slot,
}: TimeSlotProps) => {
  const { socket } = useSocketStore();

  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [userData, setUserData] = useState<SessionUser | undefined>();

  const { toast } = useToast();

  useEffect(() => {
    setIsBooked(isBookedBy);
    setTitle(slot?.title || "");
    setUserData(slot?.user);
  }, [isBookedBy, slot]);

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
      (
        bookedDay: string,
        bookedTime: string,
        bookedTitle: string,
        user: SessionUser
      ) => {
        if (bookedDay === day && bookedTime === time) {
          setIsBooked(true);
          setTitle(bookedTitle);
          setUserData(user);
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
        body: JSON.stringify({
          title: title.trim(),
          day,
          time,
          userId: session?.user.id,
        }),
      });
      setIsBooking(false);
      const message = await response.json();
      if (response.status >= 200 && response.status < 300) {
        setIsBooked(true);
        socket?.emit(
          "reservation",
          message.day,
          message.time,
          message.title,
          session?.user
        );
      } else {
        setIsBooked(false);
        socket?.emit("cancel booking", day, time);
        toast({
          duration: 3500,
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: message.errors,
        });
        setTitle("");
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
    if (isOpen && !isBooked) {
      socket?.emit("booking", day, time);
      setIsBooking(true);
    } else if (!isOpen && isBooking) {
      socket?.emit("cancel booking", day, time);
      setIsBooking(false);
    } else if (isBooked) {
      setIsBooking(false);
    }
  };

  return (
    <div className="border-t h-14 w-full">
      <Popover open={isBooking} onOpenChange={handleBooking}>
        <PopoverTrigger
          aria-label="Book a time slot"
          className="w-full h-14"
          disabled={isBooked}
          onClick={() => {
            setIsBooking(true);
          }}
        >
          {(isBooked || isBooking) && (
            <HoverCard openDelay={50}>
              <HoverCardTrigger asChild>
                <div className="bg-black text-white h-14 w-full rounded-sm shadow-md drop-shadow-lg grid place-content-center px-2 overflow-hidden">
                  {title || "booking..."}
                </div>
              </HoverCardTrigger>
              {userData && (
                <HoverCardContent
                  className={`bg-black w-[340px] ${!userData && "hidden"}`}
                >
                  <div className="flex items-center justify-evenly gap-3">
                    <Avatar className="w-14 h-14">
                      <AvatarImage
                        src={userData?.image}
                        alt={day! + time! + userData.email}
                      />
                      <AvatarFallback>
                        {userData.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-white flex items-start flex-col">
                      <h2>{userData.name}</h2>
                      <h2>{userData.email}</h2>
                      <h3 className="flex gap-2 items-center">
                        <IoCalendarNumber />
                        {day} {time}
                      </h3>
                    </div>
                  </div>
                </HoverCardContent>
              )}
            </HoverCard>
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
            <Button onClick={handleBook} disabled={!session?.user.id}>
              Confirm
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};
