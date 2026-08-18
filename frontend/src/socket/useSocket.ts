import { SocketContext } from "@/socket/SocketContext";
import { useContext } from "react";

export const useSocket = () => useContext(SocketContext);