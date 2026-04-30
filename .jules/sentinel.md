
## 2024-05-01 - [Vite Static Env Fallbacks Expose Secrets]
**Vulnerability:** Client-side hardcoded fallback strings for secrets (e.g. `import.meta.env.KEY || 'secret'`) in Vite projects ship the plaintext fallback directly into the minified production bundle.
**Learning:** Vite's static replacement of `import.meta.env` means that if an environment variable is unset during build, the literal code `undefined || 'secret'` gets bundled, directly exposing the fallback to the client.
**Prevention:** Never use inline fallback strings for secrets in Vite applications. Always read the environment variables strictly and handle missing variables via explicit runtime validation that fails securely (e.g., throwing an initialization error or disabling the feature).
