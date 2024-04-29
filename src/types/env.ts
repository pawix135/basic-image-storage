import { z } from "zod";

export const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(["development", "production"]),
});

export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(process.env);
