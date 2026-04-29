## 2025-02-27 - Remove Hardcoded Secrets from Client Bundles
**Vulnerability:** Critical fallback values (e.g., `import.meta.env.KEY || 'secret_fallback'`) in Vite client-side configurations natively leak API and configuration secrets into the static minified frontend bundle when environment variables are omitted.
**Learning:** Vite natively embeds `import.meta.env` values statically during the build process, meaning any fallback string acts as an embedded hardcoded credential exposed to all clients.
**Prevention:** Strictly enforce `import.meta.env.KEY` assignments without fallbacks and implement explicit runtime validation checks to fail securely and notify if critical variables are missing.
