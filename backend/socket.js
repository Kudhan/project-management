import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                process.env.CLIENT_URL, // New standardized var
                process.env.FRONTEND_URL, // Support existing env var
                /\.vercel\.app$/        // Allow Vercel preview/production urls
            ].filter(Boolean), // Remove undefined if env var is missing
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Join a project room
        socket.on("join-project", (projectId) => {
            socket.join(projectId);
            console.log(`User ${socket.id} joined project: ${projectId}`);
        });

        // Leave a project room
        socket.on("leave-project", (projectId) => {
            socket.leave(projectId);
            console.log(`User ${socket.id} left project: ${projectId}`);
        });

        // Broadcast task updates
        socket.on("task-update", ({ projectId, task }) => {
            // Broadcast to everyone in the project room EXCEPT the sender
            socket.to(projectId).emit("task-updated", task);
        });

        // Broadcast new task creation
        socket.on("task-create", ({ projectId, task }) => {
            socket.to(projectId).emit("task-created", task);
        });

        // Handle user presence (simplified)
        socket.on("user-active", ({ projectId, user }) => {
            // Broadcast to others that this user is active
            socket.to(projectId).emit("user-joined", user);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
