import { server } from "./http";
import "./websocket/ChatService";

server.listen(3333, () => console.log("RocketSocket is running on port 3333"));