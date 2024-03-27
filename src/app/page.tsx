import BigCalendar from "@/components/shared/BigCalendar";
import { Slot } from "@prisma/client";

export default async function Home() {
  const slotsResponse = await fetch("http://localhost:3000/api/slots");
  const slots: Slot[] = await slotsResponse.json();

  return (
    <main className="flex">
      <BigCalendar slots={slots} />
    </main>
  );
}
