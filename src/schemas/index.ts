import { z } from "zod";

export const slotDto = z.object({
  title: z
    .string()
    .min(1, { message: "Title must be at least 1 character long." }),
  day: z.string(),
  time: z.string(),
  userId: z.string(),
});
