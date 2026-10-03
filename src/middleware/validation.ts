import type { Request, Response, NextFunction } from "express";
import z, { ZodSchema, ZodError } from "zod/v3";
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateData = schema.parse(req.body);
      req.body = validateData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return next(error);
    }
  };
};
export const loginSchema = z.object({
  email: z.string().email("Invalide email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(3, "Full name must be at least 3 characters long")
      .max(100, "Full name cannot exceed 100 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .min(9, "Phone number is too short")
      .max(15, "Phone number is too long"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long"),
    role: z
      .enum(["superadmin", "admin", "client"])
      .optional()
      .default("client"),
    city: z.string().optional(),
  })
  .strict();
export type RegisterInput = z.infer<typeof registerSchema>;
