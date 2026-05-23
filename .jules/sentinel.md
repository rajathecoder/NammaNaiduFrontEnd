
## 2024-05-24 - [Remove Hardcoded Fallback Secrets in Vite Builds]
**Vulnerability:** Hardcoded API keys (Firebase and Razorpay) were used as fallback values alongside `import.meta.env` (e.g., `import.meta.env.VITE_KEY || 'secret'`).
**Learning:** Vite statically embeds `import.meta.env` values into the client-side bundle if present. If the environment variable is missing during the build, the inline hardcoded fallbacks are directly shipped in the minified frontend bundle, exposing sensitive secrets.
**Prevention:** Never use inline hardcoded fallback strings for secrets. Always use strict runtime validation checks (e.g., throwing errors or displaying alerts) to protect secrets and fail gracefully when environment variables are absent.
