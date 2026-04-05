## 2024-05-18 - [CRITICAL] Fixed Hardcoded Secrets in Configs
**Vulnerability:** Several sensitive credentials (e.g., Firebase configurations and Razorpay API keys) were hardcoded directly in the frontend source code (with OR conditions acting as fallbacks: `import.meta.env.KEY || 'hardcoded_value'`).
**Learning:** Providing hardcoded fallback values for sensitive API configurations compromises the application. If the `.env` file fails to load or the CI/CD pipeline misconfigures the build, the application defaults to these hardcoded values, which could expose a production or development environment, and they become visible in the client-side bundle.
**Prevention:**
- Exclusively use `import.meta.env` for accessing secrets or configuration keys.
- Never use `|| 'hardcoded_secret'` for sensitive data.
- Implement explicit runtime checks during app initialization or critical execution paths to validate the presence of these environment variables and fail securely (e.g., throw an error or gracefully stop execution) if they are missing.
