import { users } from "../db/schema";
import { db } from "../db/connection";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { AuthenticatedRequest } from "../middleware/auth";
import { comparePassword, hashPassword } from "../utils/password";
export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        city: users.city,
        fullName: users.fullName,
        phone: users.phone,
        isActive: users.isActive,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, phone, bio, city } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const [updatedUser] = await db
      .update(users)
      .set({
        fullName,
        phone,
        city,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId as string))
      .returning({
        id: users.id,
        email: users.email,
        city: users.city,
        fullName: users.fullName,
        phone: users.phone,
        bio: users.bio,
        isActive: users.isActive,
        role: users.role,
      });
    if (!updatedUser) {
      return res.status(404).json({
        error: "The user doesn't exists ",
      });
    }
    return res.status(200).json({
      message: "The profile has updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Cannot update profile", error);
    return res.status(500).json({
      error: "Cannot update profile",
    });
  }
};
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required" });
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId as string));
    if (!user) {
      return res.status(404).json({ error: "The user doesn't exist" });
    }
    const isVerifiedPassword = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isVerifiedPassword) {
      return res.status(404).json({ error: "Invalide current password " });
    }
    const newHashedPassword = await hashPassword(newPassword);
    const [updatedUser] = await db
      .update(users)
      .set({
        password: newHashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId as string))
      .returning({
        id: users.id,
        email: users.email,
      });
    if (!updatedUser) {
      return res.status(404).json({
        error: "The user doesn't exist",
      });
    }
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Cannot change password", error);
    return res.status(500).json({
      error: "Cannot change password",
    });
  }
};
