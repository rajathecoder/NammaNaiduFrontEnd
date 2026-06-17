## 2024-06-17 - Hardcoded Client-Side Secrets
**Vulnerability:** Hardcoded API keys and secrets (Firebase and Razorpay) were statically embedded as fallback values in client-side code and the service worker.
**Learning:** Even if primary keys are injected via environment variables, statically embedded fallbacks in the source code will still expose secrets. Additionally, Service Workers loaded directly cannot read environment variables securely, leading to developers hardcoding them.
**Prevention:** Always ensure environment variables have no statically embedded secrets as fallbacks. For Service Workers, dynamically pass configuration parameters via URL query strings during registration.
