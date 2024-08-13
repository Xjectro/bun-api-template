import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { json as bodyParserJson } from "body-parser";
import { router } from "./routes";

const limiter = rateLimit({
  max: 10,
  windowMs: 5000,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParserJson());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));

app.use("/api/v1", router);

export default app;
