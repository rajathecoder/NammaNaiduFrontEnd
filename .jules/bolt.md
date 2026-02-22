## 2026-02-22 - [AdminLayout Suspense Boundary]
**Learning:** `AdminLayout` explicitly wraps its `Outlet` in a `Suspense` boundary to prevent the entire layout (header/sidebar) from unmounting during nested route navigation when using lazy-loaded child routes.
**Action:** When adding new layouts, always ensure `Outlet` is wrapped in `Suspense` to preserve layout state during navigation.
