import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecretString } from "../secret";

export function createJWT(
  payload: object,
  expiresIn: string,
  jwtSecret: string = jwtSecretString
) {
  if (typeof payload !== "object") {
    throw new Error("Payload must be plain object");
  }
  if (typeof jwtSecret !== "string" || !jwtSecret) {
    throw new Error("Jwt secret must be not empty string");
  }
  const result = jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn,
  });
  return result;
}

export function decodedJWT(token: string, jwtSecret: string = jwtSecretString) {
  if (typeof token !== "string" || !token) {
    throw new Error("Jwt Token not provided");
  }
  try {
    const result = jwt.verify(token, jwtSecret) as JwtPayload;
    return result;
  } catch (error) {
    throw new Error("Invalid or expiry token");
  }
}
