import dotenv from "dotenv";
import http from "http";
dotenv.config();
import app from "./app.js";
import { Server } from "socket.io";
import { socketHandler } from "./lib/socket.js";
const server = http.createServer(app);
// Socket.io server initialization
export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST"]
    }
});
socketHandler(io);
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
