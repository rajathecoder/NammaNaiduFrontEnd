## 2024-05-11 - Optimize List Rendering in Matches
**Learning:** List views recompute filtering and pagination during every render cycle by default. In large lists like the one in `Matches.tsx`, this leads to O(N) recalculations for any state update (even just a page change), causing significant rendering bottlenecks.
**Action:** Always separate and memoize array filtering and pagination slicing into dedicated `useMemo` hooks when dealing with list components to avoid unnecessary O(N) recalculations during re-renders.
