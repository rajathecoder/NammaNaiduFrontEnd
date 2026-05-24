## 2025-05-24 - [CRITICAL] Prevent Hardcoded Secrets in Vite Static Build
**Vulnerability:** Hardcoded fallback secrets (like `import.meta.env.KEY || 'secret'`) in Vite projects.
**Learning:** Vite statically replaces `import.meta.env` values during the build. If the environment variable is not set locally during the build process, the inline fallback string is evaluated statically and permanently embedded into the minified production client bundle (`dist/`), publicly exposing the secret to anyone analyzing the client code.
**Prevention:** Never use inline fallbacks for secrets. Enforce strict runtime validation to throw errors if critical variables are missing, ensuring failed builds/runs rather than silently exposed secrets.
