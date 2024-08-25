import crypto from "crypto";

export const generateCode = ({ length }: { length?: number }) => {
  return crypto
    .randomBytes(64)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length || 64);
};
