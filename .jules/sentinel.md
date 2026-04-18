## 2025-04-18 - Ensure Strict Environment Variables for External Services

**Vulnerability:** Critical hardcoded API keys and secrets were found in fallback configurations for Firebase (`src/services/firebase.ts`) and Razorpay (`src/pages/SubscriptionPlans/SubscriptionPlans.tsx`). These fallbacks could expose production or test keys to the client if environment variables fail to load.
**Learning:** In Vite projects, using `|| 'hardcoded_string'` after `import.meta.env.*` defeats the purpose of environment variables by embedding the secret directly into the compiled client bundle.
**Prevention:** Always rely strictly on `import.meta.env.*` without hardcoded string fallbacks for sensitive keys. Implement runtime validation checks (e.g., throwing errors or showing generic alerts) when these environment variables are missing to ensure the application "fails securely" rather than proceeding with compromised credentials or broken state.
