import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Socket } from "socket.io-client";

interface Store {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create(
  devtools<Store>((set) => ({
    socket: null,
    setSocket: (socket) => set({ socket }),
  }))
);
