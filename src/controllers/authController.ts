import { hashPassword, comparePassword } from "../utils/password";
import db from "../db/connection";
import { generateToken, verifyToken } from "../utils/jwt";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { type NewUser, users } from "../db/schema";
import { RegisterInput } from "../middleware/validation";
export const createUser = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    const { email, fullName, phone, password, city, role } =
      req.body as RegisterInput;
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        fullName,
        phone,
        password: hashedPassword,
        city,
        role: role || "client",
      })
      .returning({
        id: users.id,
        email: users.email,
        city: users.city,
        fullName: users.fullName,
        phone: users.phone,
        isActive: users.isActive,
        role: users.role,
      });
    const token = await generateToken({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
    });
    return res.json({
      message: "The user has created successfuly ",
      user: {
        id: newUser.id,
        email: newUser.email,
        city: newUser.city,
        fullName: newUser.fullName,
        phone: newUser.phone,
        isActive: newUser.isActive,
      },
      token,
    });
  } catch (e) {
    console.error("Registration error", e);
    return res.status(500).json({ error: "failed to create user" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, req.body.email));
    if (!user) res.status(401).json({ error: "Invalide credentials" });

    const isVerifiedPassword = await comparePassword(
      req.body.password,
      user.password,
    );
    if (!isVerifiedPassword)
      res.status(401).json({ error: "Invalide credentials" });
    const token = await generateToken({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
    return res.json({
      message: "The user logged in successfully ",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        city: user.city,
        phone: user.phone,
        isActive: user.isActive,
      },
      token,
    });
  } catch (e: unknown) {
    console.error("Registration error", e);
    return res.status(500).json({ message: "failed to login user" });
  }
};
