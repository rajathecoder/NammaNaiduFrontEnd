## 2024-05-31 - [Vite Static Env Fallbacks]
**Vulnerability:** Hardcoded API key fallbacks (e.g. `import.meta.env.KEY || 'secret_fallback'`) are statically embedded by Vite into the client-side bundle if the environment variable is not present during build.
**Learning:** This exposes the secret in the minified frontend bundle directly. Do not use inline fallbacks for secrets.
**Prevention:** Instead, use strict runtime validation checks (e.g., `if (!env_var) return;`) to handle missing secrets securely.
