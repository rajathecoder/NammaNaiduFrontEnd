## 2026-05-18 - Vite Static Embedding of Inline Fallbacks
**Vulnerability:** Hardcoded API keys and secrets used as inline fallbacks for `import.meta.env` (e.g., `import.meta.env.KEY || 'secret'`).
**Learning:** Vite statically embeds `import.meta.env` values into the client-side bundle at build time. If an environment variable is missing, Vite falls back to evaluating the JavaScript expression, meaning any inline hardcoded fallbacks are directly shipped in the minified frontend bundle, exposing critical secrets to the client.
**Prevention:** Always use strict runtime validation checks for required environment variables (e.g., throwing an error if `!import.meta.env.KEY`) and never include hardcoded fallback strings for secrets in the frontend codebase.
