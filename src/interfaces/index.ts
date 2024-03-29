import { Slot } from "@prisma/client";

export interface ExtendedSlot extends Slot {
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export interface SessionUser {
  name: string;
  image: string;
  email: string;
  id?: string;
}
