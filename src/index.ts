import 'dotenv/config';
import express from 'express';
import * as http from 'http';
import Server from './server';
import dbConnection from './database/dbConnection';

const app = express();
const server = new Server(app);
const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, function () {
  dbConnection();
  console.log(`Server listening on port ${process.env.PORT}`);
});

export default app;
