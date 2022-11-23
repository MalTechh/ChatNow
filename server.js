const { builtinModules } = require("module");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const server = require("http").Server(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users = {};
const rooms = {};

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { rooms: rooms });
});
app.post("/room", (req, res) => {
  if (rooms[req.body.room != null]) {
    return res.redirect("/");
  } else {
    res.redirect(req.body.room);
    io.emit("newRoom", req.body.room);
  }
});
app.get("/:room", (req, res) => {
  /*
  if (rooms[req.params.room] == null) {
    res.redirect("/");
  } else {*/
  console.log("page rendered");
  res.render("room", { roomName: req.params.room });
  //}
});

//opens websocket
io.on("connection", (socket) => {
  //listens for message and emits
  socket.on("message", (roomName, message, username) => {
    console.log("Message recieved");
    io.to(roomName).emit("message", message, username);
  });
  //listens for new users and updates users dict
  socket.on("newUser", (roomName, username) => {
    socket.join(roomName);
    if (rooms[roomName] == undefined) {
      rooms[roomName] = {};
    }
    rooms[roomName][socket.id] = username;
    io.to(roomName).emit("newUser", rooms[roomName][socket.id]);
    console.log(rooms);
  });
  //listens for a disconnection and clears name from users dict

  socket.on("disconnect", (reason) => {
    if (reason != "server namespace disconnect") {
      for (roomNames in rooms) {
        console.log(roomNames);
        if (rooms[roomNames][socket.id] != undefined) {
          console.log("disconnect from " + roomNames);
          io.to(roomNames).emit("left", rooms[roomNames][socket.id], roomNames);
          delete rooms[roomNames][socket.id];
        }
      }
      console.log(rooms);
      /*
        console.log("disconnect from " + roomName);
        io.to(roomName).emit("left", rooms[roomName][socket.id]);
        delete rooms[roomName][socket.id];*/
    }
  });
  socket.on("loadUsers", (roomName) => {
    io.to(roomName).emit("loadUsers", rooms[roomName]);
  });
  //Check today
  socket.on("UpdateTitle", () => {
    io.emit("UpdateTitle");
  });
  /*
  socket.on("newRoom", (room) => {
    console.log(rooms, room);
    io.emit("newRoom", room);
  });*/
});

server.listen(5000, () => console.log("Listening"));
