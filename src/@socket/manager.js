import { io, Manager } from "socket.io-client";

const manager = new Manager("http://localhost:8081", {
  transports: ["websocket"],
  autoConnect: false
});



export default manager;
