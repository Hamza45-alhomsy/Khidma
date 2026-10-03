import type { Request, Response, NextFunction } from "express";
import { type JwtPayload, verifyToken } from "../utils/jwt";
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }
    const payload = await verifyToken(token as string);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user)
      return res.status(403).json({ error: "Forbidden. there is no user" });
    if (req.user.role !== "admin" && req.user.role !== "superadmin ") {
      return res
        .status(403)
        .json({ error: "Forbidden. Admin access required." });
    }
    return next();
  } catch (error) {
    return res.status(403).json({ error: "Forbidden. Admin access required." });
  }
};
export const requireSuperAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user)
      return res.status(403).json({ error: "Forbidden. there is no user" });
    if (req.user.role !== "superadmin ") {
      return res
        .status(403)
        .json({ error: "Forbidden.Super Admin access required." });
    }
    return next();
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Forbidden.Super Admin access required." });
  }
};
