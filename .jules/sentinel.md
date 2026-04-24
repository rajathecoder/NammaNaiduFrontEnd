## 2025-02-14 - Fix hardcoded environment variable fallbacks
**Vulnerability:** The codebase was exposing API keys (Firebase API keys and Razorpay key) directly in the client bundle by using string fallbacks (e.g., `import.meta.env.KEY || 'hardcoded_secret'`).
**Learning:** Development defaults should never be hardcoded into the source code as string fallbacks, as they leak into the production build and expose internal project keys if the production environment variables are not correctly set.
**Prevention:** Always set API keys exclusively via environment variables (`import.meta.env`) without a fallback, and explicitly add runtime validation checks that fail securely (e.g., throwing a generic error or alerting the user) when required variables are missing.
