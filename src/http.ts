import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);

mongoose.connect("mongodb://localhost/rocketsocket", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(express.static(path.join(__dirname, "..", "public")));

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Socket", socket.id);
});

app.get("/", (request, response) => {
  return response.status(200).json("Done");
})

export {server, io};