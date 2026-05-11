## 2025-05-11 - Removed Hardcoded Secrets from Environment Variable Fallbacks
**Vulnerability:** Client-side secrets (Firebase API keys and Razorpay key) were vulnerable to exposure due to fallback hardcoded values in `import.meta.env` accessors (e.g., `import.meta.env.KEY || 'secret'`).
**Learning:** Vite statically replaces `import.meta.env` references. If an environment variable is not set at build time, the fallback string is bundled directly into the minified client code, exposing the secret.
**Prevention:** Never use inline fallback strings for sensitive configuration variables in Vite applications. Instead, strictly type and rely on the environment variables directly, utilizing runtime validation checks to securely throw errors if missing before application logic executes.
