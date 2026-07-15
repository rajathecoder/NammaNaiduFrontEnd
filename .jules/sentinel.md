## 2024-05-24 - Hardcoded Secrets in Config
**Vulnerability:** Found hardcoded fallback values for Firebase and Razorpay configuration keys in the frontend source code (e.g., `import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDBJg...'`).
**Learning:** Hardcoding fallback keys in frontend files, even if intended for local development or testing, risks exposing sensitive credentials in the production bundle if environment variables are missing. This is a critical security vulnerability.
**Prevention:** Strictly rely on `import.meta.env` for environment variables and cast them `as string` (or throw an error if missing) without providing static hardcoded fallbacks to prevent accidental credential leakage in production.
