## 2025-02-19 - Large Monolithic Bundle Strategy
**Learning:** The application was using a monolithic bundle strategy by statically importing all pages in `App.tsx`. This resulted in a very large initial bundle size. Additionally, `LandingPage` alone is ~900KB, highlighting the critical need for lazy loading, especially for users who might just go straight to login or dashboard.
**Action:** Always check `App.tsx` or the main router configuration first in React apps. If static imports are used for routes, switching to `React.lazy` is almost always a high-value, low-risk win.
