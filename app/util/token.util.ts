import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_TOKEN_EXPIRE || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

export const generateToken = (userId: string): string => {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as StringValue | number,
  };
  return jwt.sign({ sub: userId }, JWT_SECRET, options);
};

export const validateToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};
