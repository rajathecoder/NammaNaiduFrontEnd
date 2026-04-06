## 2024-04-06 - Prevent Client-Side Secret Exposure via Fallback Values
**Vulnerability:** Hardcoded API keys and secrets (Firebase API Key, Razorpay Key) were used as fallback values (`|| 'secret'`) for environment variables.
**Learning:** Even if `import.meta.env` is intended to be used, providing a fallback string literal exposes the secret in the client-side bundle if the environment variable fails to load or is not set in a specific environment.
**Prevention:** Never use hardcoded strings as fallbacks for secrets. Instead, implement explicit runtime checks that securely fail (e.g., throwing an error or showing a generic alert) if the required environment variables are missing.
