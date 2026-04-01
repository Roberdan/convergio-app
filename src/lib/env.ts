import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("Convergio"),
  /** Public URL for client-side API calls (optional — falls back to API_URL). */
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  /** Server-side backend URL. Defaults to localhost for starter / offline mode. */
  API_URL: z.string().url().default("http://localhost:8420"),
  API_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  // Prefer the explicit server-side var; fall back to the public one if set.
  API_URL: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL,
  API_SECRET: process.env.API_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});
