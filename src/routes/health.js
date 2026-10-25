import { Router } from "express";
import { config } from "../config.js";
const router = Router();

router.get("/health", (_req, res) => res.status(200).json({
  status: "ok",
  service: "mfc-backend",
  environment: config.NODE_ENV,
  crossmintEnvironment: config.CROSSMINT_ENV,
  timestamp: new Date().toISOString()
}));

router.get("/config", (_req, res) => res.json({
  crossmintEnvironment: config.CROSSMINT_ENV,
  serverKeyConfigured: Boolean(config.CROSSMINT_SERVER_SIDE_API_KEY)
}));
export default router;
