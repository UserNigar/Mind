import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

import "./src/db/Connection.js";
import appRouter from "./src/routes/appRouter.js";
import adminRouter from "./src/routes/adminRouter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/photos", express.static(path.join(__dirname, "public/photos")));
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", appRouter);
app.use("/api/admin", adminRouter);



let onlineUsers = {};  

io.on("connection", (socket) => {
  console.log("Yeni istifadəçi qoşuldu:", socket.id);


  socket.on("join", (username) => {
    onlineUsers[username] = socket.id;
    console.log(`${username} qoşuldu`);
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });


  socket.on("privateMessage", ({ toUsername, message, fromUsername }) => {
    const toSocketId = onlineUsers[toUsername];
    if (toSocketId) {
      io.to(toSocketId).emit("privateMessage", {
        message,
        fromUsername,
      });
    }
  });


  socket.on("call-user", ({ toUsername, offer, name }) => {
    const toSocketId = onlineUsers[toUsername];
    if (toSocketId) {
      io.to(toSocketId).emit("call-made", {
        offer,
        from: socket.id,
        name,
      });
    }
  });


  socket.on("make-answer", ({ to, answer }) => {
    io.to(to).emit("answer-made", {
      answer,
      from: socket.id,
    });
  });


  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", {
      candidate,
      from: socket.id,
    });
  });


  socket.on("reject-call", ({ from }) => {
    io.to(from).emit("call-rejected", {
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const disconnectedUser = Object.keys(onlineUsers).find(
      (username) => onlineUsers[username] === socket.id
    );
    if (disconnectedUser) {
      delete onlineUsers[disconnectedUser];
      console.log(`${disconnectedUser} ayrıldı`);
    }
    io.emit("onlineUsers", Object.keys(onlineUsers));
  });
});



const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işləyir`);
});
