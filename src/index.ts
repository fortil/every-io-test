import { Server } from "./server";

const server = new Server();

server.initDatabase().then(() => {
  server.start();
});
