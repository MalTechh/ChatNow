const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Someone Joined the Chat!");

  socket.on("message", (message) => {
    io.emit("message", message);
  });
});

httpServer.listen(3000, () => console.log("Listening on port 3000"));
