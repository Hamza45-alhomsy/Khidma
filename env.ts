// @ts-ignore
import { env as loadEnv } from "custom-env";
import { is } from "drizzle-orm";
import { z, ZodError } from "zod";
process.env.APP_STAGE = process.env.APP_STAGE || "dev";
const isProduction = process.env.APP_STAGE === "production";
const isTesting = process.env.APP_STAGE === "test";

if (isProduction) {
  loadEnv("production");
} else if (isTesting) {
  loadEnv("test");
} else {
  loadEnv("dev");
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_STAGE: z.enum(["dev", "test", "production"]).default("dev"),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),
  // CORS configuration
  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .default(["http://localhost:3000"])
    .transform((val) => {
      if (typeof val === "string") {
        return val.split(",").map((origin) => origin.trim());
      }
      return val;
    }),
});

export type ENV = z.infer<typeof envSchema>;
let env: ENV;
try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log("Invalide environment variables");
    console.log(JSON.stringify(z.treeifyError(error), null, 2));
    error.issues.forEach((issue) => {
      console.log(`-${issue.path.join(".")} : ${issue.message}`);
    });
    process.exit(1);
  }
  throw error;
}
export const isProd = () => env.APP_STAGE === "production";
export const isDev = () => env.APP_STAGE === "dev";
export const isTest = () => env.APP_STAGE === "test";

export { env };
export default env;
