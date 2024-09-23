import "dotenv/config";
import express from "express";
import * as http from "http";
import Server from "./server";
import dbConnection from "./database/dbConnection";
import { config } from "./constants";

const PORT = config.port;
const app = express();
const server = new Server(app);
const httpServer = http.createServer(app);

httpServer.listen(PORT, function () {
  dbConnection();
  console.log(`Server listening on port ${PORT}`);
});

export default app;
