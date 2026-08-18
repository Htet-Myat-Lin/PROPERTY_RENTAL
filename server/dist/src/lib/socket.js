import { registerChatSocketHandler } from "@/modules/chat/chat.socket";
import { AppError } from "@/utils/app.error";
import { verifyAccessToken } from "@/utils/jwt";
export const socketHandler = (io) => {
    io.use((socket, next) => {
        const { token } = socket.handshake.auth;
        if (!token)
            return next(new AppError("Unauthorized", 401));
        try {
            const decoded = verifyAccessToken(token);
            if (!decoded?.id)
                return next(new AppError("Unauthorized", 401));
            socket.data.userId = decoded.id;
            next();
        }
        catch (error) {
            return next(new AppError("Unauthorized", 401));
        }
    });
    io.on("connection", (socket) => {
        // Connect
        socket.on("connect", () => {
            console.log(`User ${socket.data.userId} connected`);
        });
        // Chat Socket Handler
        registerChatSocketHandler(io, socket);
        // Disconnect
        socket.on("disconnect", (reason) => {
            console.log(`Disconnected: ${reason}`);
        });
    });
};
