import { type Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { json as bodyParserJson } from "body-parser";
import Routes from "./routes";

const limiter = rateLimit({
  max: 10,
  windowMs: 5000,
});

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    app.use(cors());
    app.use(helmet());
    app.use(limiter);
    app.use(bodyParserJson());
    app.use(
      morgan(":method :url :status :res[content-length] - :response-time ms"),
    );
  }
}
