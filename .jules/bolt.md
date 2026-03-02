
## 2025-03-02 - Implement route-based code splitting
**Learning:** The application was statically importing all page components in `App.tsx`, leading to a massive initial bundle size (~3.2MB before gzip) that was flagged by the Vite build step.
**Action:** Always implement route-based code splitting for large SPA applications using `React.lazy()` and `Suspense` at the router level. This drops the main initial bundle size significantly (down to ~747kB in this instance), separating heavy page dependencies into their own chunks (e.g., `LandingPage` and its 3D assets).
