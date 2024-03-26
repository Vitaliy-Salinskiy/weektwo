import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Socket, io } from "socket.io-client";

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

export const setupSocket = () => {
  const { setSocket } = useSocketStore.getState();
  const socket = io("http://localhost:5000");
  setSocket(socket);

  return () => {
    socket.disconnect();
  };
};
