# MFC Backend

A separate Node.js/Express backend for MFC. It reads secrets from environment variables and never returns keys in API responses.

## Deploy on Render

1. Download this ZIP and extract it.
2. Push the folder contents to a separate GitHub repository named `MFC-Backend`. Do not upload real keys or `.env`.
3. Create a Render Web Service from that repository. Use Node runtime, build command `npm install`, start command `npm start`, health check `/api/health`.
4. In Render > Environment, set:
   - `CROSSMINT_SERVER_SIDE_API_KEY`: server-side key for your selected Crossmint environment.
   - `CROSSMINT_CLIENT_SIDE_API_KEY`: optional; a client key is normally used in frontend code only for supported client-side features and is not a server secret.
   - `CROSSMINT_ENV`: `staging` initially. Set `production` only after Crossmint enables production features.
   - `CLIENT_ORIGIN`: your exact MFC frontend origin, e.g. `https://your-mfc-frontend.example` (comma-separated origins supported).
   - `MFC_BACKEND_SHARED_TOKEN`: optional long random token. Do not embed a permanent shared token in a public web/mobile app; users can extract it.
   - `CROSSMINT_API_BASE_URL`: leave blank unless current Crossmint docs tell you otherwise.
5. Deploy, then visit `https://YOUR-SERVICE.onrender.com/api/health`.

## Endpoints

- `GET /api/health`: health check.
- `GET /api/config`: safe config only; no keys.
- `GET /api/crossmint/status`: shows whether keys are configured, never their values.
- `POST /api/crossmint/request`: intentionally returns 501 until the exact Crossmint money-movement contract, user authentication, validation, and idempotency are implemented. This prevents a generic unauthenticated money-transfer proxy.

## Important security limitations

- Never put the server key in React/Vite, an APK, or a public repository. Rotate any key that has been exposed.
- CORS is not authentication. A public app cannot securely hide a shared static secret.
- This is a secure deployment scaffold, not yet a production-ready financial service. Before enabling money movement, add real user authentication/authorization, idempotency, signed webhook verification, audit logs, transaction-status reconciliation, and fraud/abuse controls.
- Confirm Crossmint supports your country, KES, M-Pesa, intended USDT network, and your account eligibility before handling real funds.
- Render free instances may sleep and are not suitable for guaranteed real-time transaction processing or webhook delivery.
