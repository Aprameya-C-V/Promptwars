import { z } from "zod";

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).optional(),
  ALLOWED_ORIGIN: z.string().default("http://localhost:3000"),
  PORT: z.coerce.number().int().positive().default(4000)
});

export const env = envSchema.parse(process.env);

