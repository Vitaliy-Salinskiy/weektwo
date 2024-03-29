import { useSocketStore } from "@/store/socketStore";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSetupSocket = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL as string;

  const { setSocket } = useSocketStore();

  useEffect(() => {
    const socket = io(serverUrl);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [setSocket, serverUrl]);
};
