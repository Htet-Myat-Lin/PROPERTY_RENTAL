import { io } from "socket.io-client";

// Socket.io client initialization
export const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
    withCredentials: true,
    reconnection: true,
    transports: ["websocket"],
});
