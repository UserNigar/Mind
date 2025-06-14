import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";  // əlavə

import "./src/db/Connection.js";
import appRouter from "./src/routes/appRouter.js";
import { Server } from "socket.io";  // socket.io-dan import

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

let onlineUsers = {};

io.on('connection', (socket) => {
  console.log('Yeni istifadəçi qoşuldu:', socket.id);

  socket.on('join', (username) => {
    onlineUsers[socket.id] = username;
    console.log(`${username} qoşuldu`);
    io.emit('onlineUsers', Object.values(onlineUsers));
  });

  socket.on('privateMessage', ({ toUsername, message, fromUsername }) => {
    const receiverSocketId = Object.entries(onlineUsers).find(
      ([socketId, username]) => username === toUsername
    )?.[0];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('privateMessage', {
        message,
        fromUsername,
      });
    }
  });

  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit('onlineUsers', Object.values(onlineUsers));
    console.log(`${username} ayrıldı`);
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/photos", express.static(path.join(__dirname, "public/photos")));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", appRouter);

server.listen(5050, () => {
  console.log(`Server 5050 portunda işləyir`);
});
