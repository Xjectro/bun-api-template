import { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import cors from 'cors';
import { json as bodyParserJson } from 'body-parser';
import Routes from './routes';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 5000;

export default class Server {
  private readonly limiter: RateLimitRequestHandler;

  constructor(private readonly app: Application) {
    this.limiter = this.createRateLimiter();
    this.configureMiddleware();
    this.configureRoutes();
  }

  private createRateLimiter(): RateLimitRequestHandler {
    return rateLimit({
      max: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(this.limiter);
    this.app.use(bodyParserJson());
    this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  }

  private configureRoutes(): void {
    new Routes(this.app);
  }
}
