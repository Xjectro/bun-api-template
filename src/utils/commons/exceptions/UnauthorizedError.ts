import { CustomError } from "./index";

class UnauthorizedError extends CustomError {
  constructor(
    message?: string,
    public content?: any,
  ) {
    super(401, message || "You need to login to access this resource!");
    this.name = "UnauthorizedError";
    this.content = content;

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export default UnauthorizedError;
