## 2024-04-14 - Prevent Hardcoded API Key Fallbacks
**Vulnerability:** Codebase contained hardcoded default string values for `VITE_FIREBASE_API_KEY` and `VITE_RAZORPAY_KEY_ID`.
**Learning:** Using `|| "default_key"` patterns in environment variable assignments allows testing keys or potential secrets to bypass environment configurations and be leaked directly into the build artifact.
**Prevention:** Always use static `import.meta.env.*` access without string fallbacks, and pair this with runtime checks (`if (!key) throw new Error(...)`) to fail securely if secrets are missing.
