import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { apiLimiter } from "./middleware/security.js";
import healthRoutes from "./routes/health.js";
import crossmintRoutes from "./routes/crossmint.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = config.CLIENT_ORIGIN.split(",").map(v => v.trim()).filter(Boolean);
    if (config.NODE_ENV !== "production" && allowed.length === 0) return callback(null, true);
    return callback(null, allowed.includes(origin));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600
}));
app.use(express.json({ limit: "20kb", strict: true }));
app.use("/api", apiLimiter);
app.use("/api", healthRoutes);
app.use("/api/crossmint", crossmintRoutes);
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("Request failed:", err?.message || "unknown error");
  if (res.headersSent) return;
  res.status(400).json({ error: "Invalid request" });
});

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`MFC backend listening on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}; Crossmint: ${config.CROSSMINT_ENV}`);
  console.log(`Server API key configured: ${Boolean(config.CROSSMINT_SERVER_SIDE_API_KEY)}`);
});
