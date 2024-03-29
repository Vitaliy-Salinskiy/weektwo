import BigCalendar from "@/components/shared/BigCalendar";
import { ExtendedSlot } from "@/interfaces";

export default async function Home() {
  const slotsResponse = await fetch(
    `https://weektwo-6reh40v5o-vitaliys-projects-e60c5620.vercel.app/api/slots`
  );
  const slots: Partial<ExtendedSlot[]> = await slotsResponse.json();

  return (
    <main className="flex">
      <BigCalendar slots={[]} />
    </main>
  );
}
