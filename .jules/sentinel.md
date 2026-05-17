## 2025-02-28 - Removed hardcoded API Key fallbacks in frontend code
**Vulnerability:** Hardcoded API keys (Firebase, Razorpay) were used as fallback values in the frontend code when environment variables were missing.
**Learning:** Vite bundles `import.meta.env.*` variables statically. If a fallback is hardcoded (e.g., `import.meta.env.KEY || 'secret'`), the 'secret' is directly included in the final minified client bundle, exposing it to any user inspecting the site's source code.
**Prevention:** Always rely strictly on runtime validation (`if (!import.meta.env.KEY) throw new Error(...)`) and omit fallback strings in code to ensure sensitive values remain server-side or are strictly injected via `.env` configuration during build.
