import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Socket } from "socket.io-client";
import { useAppStore } from "../store";
import { SocketContext } from "@/socket/SocketContext";
import { socket } from "@/socket/socket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socketConnection, setSocketConnection] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppStore((state) => state.accessToken);

  useEffect(() => {
    socket.auth = { token };

    const handleConnect = () => {
      setSocketConnection(socket);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setSocketConnection(null);
      setIsConnected(false);
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connection error:", err);
      setSocketConnection(null);
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (token) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketConnection, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
