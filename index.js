const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const app = express();
const port = process.env.PORT || 8000;
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-client-abid.netlify.app/",
      "chat-app-tajwar.netlify.app",
    ],
    credentials: true,
  })
);

const users = [{}];

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("We have a new connection!");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log("joined", user);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `welcome to the chat ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ id, message }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left`,
    });
    console.log("User had left!!!");
  });
});

app.get("/", (req, res) => {
  res.send("Server is running.");
});

server.listen(port, () => console.log(`Server has started on port ${port}`));
