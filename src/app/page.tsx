import { getServerSession } from "next-auth";
import { Metadata } from "next";

import BigCalendar from "@/components/shared/BigCalendar";
import { options } from "./api/auth/[...nextauth]/options";

import { ExtendedSlot } from "@/interfaces";

export const metadata: Metadata = {
  title: "Weektwo | Home page",
  description: "Next generation scheduling app",
};

export default async function Home() {
  const session = await getServerSession(options);

  const slotsResponse = await fetch(`${process.env.VERCEL_URL}/api/slots`);
  const slots: Partial<ExtendedSlot[]> = await slotsResponse.json();

  return (
    <main className="flex">
      <BigCalendar slots={slots} session={session} />
    </main>
  );
}
