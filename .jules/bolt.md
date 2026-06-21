## 2024-05-19 - Concurrent Fetching & Memoization in Matches

**Learning:** When fetching dependent or independent datasets for complex views like `Matches`, sequential API calls create a noticeable waterfall effect delaying the initial render. Furthermore, mapping filtered lists without `useMemo` in large components leads to unnecessary re-computations when independent state (like button statuses) change.

**Action:** Always identify opportunities to group initial data requirements using `Promise.all()` to flatten the network waterfall, and wrap computed derived states in `useMemo` when they depend on specific props/states to prevent performance degradation on unrelated component updates.
