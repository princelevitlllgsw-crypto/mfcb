import { timingSafeEqual } from "node:crypto";
import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Try again shortly." }
});

export function requireSharedToken(req, res, next) {
  // A static token shipped inside a public frontend/APK can be extracted.
  // Use proper user authentication before enabling financial actions.
  const expected = config.MFC_BACKEND_SHARED_TOKEN;
  if (!expected) {
    return res.status(503).json({ error: "Protected operation is disabled until authentication is configured." });
  }
  const auth = req.get("authorization") || "";
  const supplied = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (!supplied || a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return next();
}
