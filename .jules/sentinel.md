
## 2026-05-30 - Inline Environment Fallbacks Exposing Secrets in Vite
**Vulnerability:** Hardcoded API keys (e.g., Firebase and Razorpay) were found embedded directly inside client-side components using inline fallbacks like `import.meta.env.KEY || 'secret_fallback'`.
**Learning:** Vite statically resolves `import.meta.env` during build. If the environment variable isn't present during the build, Vite embeds the inline fallback directly into the minified Javascript bundles, creating a direct exposure of sensitive credentials to the client.
**Prevention:** Always validate missing environment keys at runtime with early returns and error handling instead of providing inline fallback values in the frontend code.
