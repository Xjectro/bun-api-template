import { z } from "zod";
import { UnprocessableEntityError } from "../utils/exceptions";

export const extractValidationErrors = (
  result: z.SafeParseError<any>,
): any[] => {
  return result.error.issues.map((issue) => ({
    [issue.path[0]]: issue.message.replace(/_/g, " "),
  }));
};

export const throwValidationError = (errors: any[]): void => {
  if (errors.length > 0) {
    throw new UnprocessableEntityError("Validation Failed", errors);
  }
};
