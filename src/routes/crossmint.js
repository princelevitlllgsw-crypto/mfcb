import { Router } from "express";
import { config } from "../config.js";
import { requireSharedToken } from "../middleware/security.js";
const router = Router();

router.get("/status", (_req, res) => res.json({
  provider: "crossmint",
  environment: config.CROSSMINT_ENV,
  serverKeyConfigured: Boolean(config.CROSSMINT_SERVER_SIDE_API_KEY),
  clientKeyConfigured: Boolean(config.CROSSMINT_CLIENT_SIDE_API_KEY),
  note: "API keys are never returned."
}));

// Intentionally disabled until the exact provider API and secure user flow are implemented.
router.post("/request", requireSharedToken, (_req, res) => res.status(501).json({
  error: "Crossmint money-movement endpoint is not enabled yet.",
  message: "Implement and verify the current provider API, user authentication, request schema, idempotency, and payout eligibility before enabling real transactions."
}));
export default router;
