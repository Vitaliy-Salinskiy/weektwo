import BigCalendar from "@/components/shared/BigCalendar";
import { ExtendedSlot } from "@/interfaces";

export default async function Home() {
  const slotsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/slots`
  );
  const slots: Partial<ExtendedSlot[]> = await slotsResponse.json();

  return (
    <main className="flex">
      <BigCalendar slots={slots} />
    </main>
  );
}
