## 2024-05-20 - [Hardcoded Secrets Removal]
**Vulnerability:** Hardcoded fallback credentials for Firebase and Razorpay found in production codebase.
**Learning:** Hardcoded fallbacks undermine environment variable protection, leading to critical credential leakage if deployed without proper `.env` setup.
**Prevention:** Strictly use `import.meta.env` without string fallbacks for any sensitive keys, and implement explicit runtime checks (e.g., `if (!env.KEY) throw Error(...)`) to fail securely.
