import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env.local" });
dotenv.config();

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).optional(),
  ALLOWED_ORIGIN: z.string().default("http://localhost:3000"),
  PORT: z.coerce.number().int().positive().default(4000)
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  ALLOWED_ORIGINS: parsedEnv.ALLOWED_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
};
