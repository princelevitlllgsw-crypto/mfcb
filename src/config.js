import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  CROSSMINT_ENV: z.enum(["staging", "production"]).default("staging"),
  CROSSMINT_SERVER_SIDE_API_KEY: z.string().trim().optional().default(""),
  CROSSMINT_CLIENT_SIDE_API_KEY: z.string().trim().optional().default(""),
  CLIENT_ORIGIN: z.string().trim().optional().default(""),
  CROSSMINT_API_BASE_URL: z.string().trim().optional().default(""),
  MFC_BACKEND_SHARED_TOKEN: z.string().trim().optional().default("")
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.issues.map(i => ({
    field: i.path.join("."),
    message: i.message
  })));
  process.exit(1);
}
export const config = Object.freeze(parsed.data);
