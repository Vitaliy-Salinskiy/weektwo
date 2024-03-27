import { prisma } from "@/lib/prisma";
import { slotDto } from "@/schemas";
import { revalidatePath } from "next/cache";

export const POST = async (request: Request) => {
  const dto: {
    title: string;
    day: string;
    time: string;
    userId: string;
  } = await request.json();

  if (!dto) {
    return new Response("Bad Request", { status: 400 });
  }

  const isValid = slotDto.safeParse(dto);

  if (!isValid.success) {
    const errorMessages = isValid.error.issues.map((issue) => issue.message);
    return new Response(JSON.stringify({ errors: errorMessages }), {
      status: 400,
    });
  }

  try {
    const response = await prisma.slot.create({
      data: {
        day: dto.day,
        time: dto.time,
        title: dto.title,
        userId: dto.userId,
      },
    });

    revalidatePath("/");

    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const GET = async () => {
  try {
    const slots = await prisma.slot.findMany();

    return new Response(JSON.stringify(slots), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Something went wrong" }), {
      status: 500,
    });
  }
};
