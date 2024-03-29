import { headers } from "next/headers";

import BigCalendar from "@/components/shared/BigCalendar";
import { ExtendedSlot } from "@/interfaces";

export default async function Home() {
  const headersList = headers();
  const fullUrl = headersList.get("referer") || "";

  const slotsResponse = await fetch(`${fullUrl}api/slots`);
  const slots: Partial<ExtendedSlot[]> = await slotsResponse.json();

  return (
    <main className="flex">
      <BigCalendar slots={slots} />
    </main>
  );
}
