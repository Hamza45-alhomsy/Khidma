import { createSecretKey } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import env from "../../env";
export interface JwtPayload {
  id: string;
  fullName: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const generateToken = (payload: JwtPayload): Promise<string> => {
  const secret = env.JWT_SECRET;
  const secretKey = createSecretKey(secret, "utf-8");

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.JWT_EXPIRES_IN || "7d")
    .setIssuedAt()
    .sign(secretKey);
};
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secret = env.JWT_SECRET;
  const secretKey = createSecretKey(secret, "utf-8");
  const { payload } = await jwtVerify(token, secretKey);
  return {
    id: payload.id as string,
    email: payload.email as string,
    fullName: payload.fullName as string,
    role: payload.role as string,
  };
};
