
## 2024-10-25 - Prevent inline hardcoded fallbacks for env vars
**Vulnerability:** Inline hardcoded fallbacks for environment variables (like `import.meta.env.KEY || 'secret_string'`) leak the sensitive string into the minified production bundle.
**Learning:** Vite statically replaces `import.meta.env.*` occurrences during the build process. If the environment variable isn't present during build, the literal fallback string gets shipped to the client, exposing the secret.
**Prevention:** Always use strict runtime validation checks for environment variables instead of providing hardcoded strings. If a critical key is missing, throw an error or display an alert rather than using a fallback.
