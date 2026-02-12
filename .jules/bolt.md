## 2024-05-22 - Code Splitting Strategy
**Learning:** Route-based code splitting with React.lazy is effective but requires careful handling of layout components (like AdminLayout). Simply wrapping top-level Routes in Suspense causes layout thrashing (unmounting sidebar/header) when navigating between child routes.
**Action:** Always wrap Outlet in Suspense within persistent layout components to keep the shell mounted while child routes load. Use a lightweight fallback (e.g., CSS spinner) instead of heavy libraries (e.g., Lottie) for the initial load to maximize bundle size reduction.
