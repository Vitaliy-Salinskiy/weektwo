import { useSocketStore } from "@/store/socketStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSetupSocket = () => {
  const { setSocket } = useSocketStore();

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
};
