import { rateLimit } from "express-rate-limit";

// 1. Global Limiter (Applied to all routes)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests. Please try again later.",
  },
});

// 2. Strict Auth Limiter (Applied to /login, /register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 6, // Only 5 attempts per IP per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error:
      "Too many authentication attempts. Please try again after 15 minutes.",
  },
});

// 3. Creation Limiter (Applied when users post a service or task)
export const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // Max 10 new services/tasks created per hour
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "You have reached the posting limit for this hour. Try again later.",
  },
});
