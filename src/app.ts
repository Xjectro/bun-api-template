import "dotenv/config";
import * as http from "http";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { v1 } from "./controller";
import { connect as dbConnection } from "./database/dbConnection";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { json as bodyParserJson } from "body-parser";
import { config } from "./constants";

const limiter = rateLimit({
  windowMs: 5000,
  max: 10,
});

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParserJson());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use("/api/v1", v1);

httpServer.listen(config.port, function () {
  dbConnection();
  console.log(`Server listening on port ${config.port}`);
});

export default app;