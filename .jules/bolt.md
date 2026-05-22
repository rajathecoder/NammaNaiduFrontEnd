## 2024-05-22 - Optimizing Inline Array Filtering in React
**Learning:** Found a common React performance anti-pattern where an O(N) array `.filter()` and object allocations like `new Date()` were executing on every single render in `Matches.tsx`. While generic, the volume of profiles makes this impactful for slower devices.
**Action:** When filtering dynamic arrays based on state (like `selectedFilter`), always extract the logic into a `useMemo` hook dependent only on the necessary variables. Ensure invariant logic (like static dates) inside loop boundaries are hoisted outside.
