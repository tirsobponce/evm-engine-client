import { z } from "zod";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define schema for environment variables
const envSchema = z.object({
  ENGINE_URL: z.string().url("BLOCKUS_API_URL must be a valid URL."),
  ENGINE_TOKEN: z.string().min(1, "ENGINE_TOKEN is required."),
});

// Parse and validate environment variables
const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error("❌ Invalid environment variables:");
  console.error(envParse.error.format());
  throw new Error("Invalid environment variables");
}

// Export typed environment variables
export const env = envParse.data;
