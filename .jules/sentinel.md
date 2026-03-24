
## 2025-02-23 - Hardcoded Secrets Fallback Removal
**Vulnerability:** Codebase utilized hardcoded API keys and secrets (e.g., Firebase, Razorpay) as fallbacks when environment variables were not loaded.
**Learning:** Hardcoded fallbacks undermine environment-based configuration security. If an `.env` variable fails to load, the system silently uses the insecure, hardcoded key, risking exposure of testing/production credentials in version control.
**Prevention:** Implement strict runtime checks using explicit keys from `import.meta.env`. Throwing a critical error securely halts the application instead of degrading silently to exposed values.
