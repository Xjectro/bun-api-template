import { CustomError } from "./index";

class InternalServerError extends CustomError {
  constructor(
    message?: string,
    public content?: any,
  ) {
    super(500, message || "Internal Server Error!");
    this.name = "InternalServerError";
    this.content = content;

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export default InternalServerError;
