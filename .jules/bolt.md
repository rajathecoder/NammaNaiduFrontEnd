
## 2025-02-14 - Concurrent Data Fetching and Memoization Optimization
**Learning:** In React components making multiple independent API requests on mount (like `Matches.tsx`), sequential fetching can severely degrade load times due to network waterfalls. Wrapping derived states based on complex lists in `useMemo` avoids redundant re-evaluations during re-renders.
**Action:** Always inspect `useEffect` blocks fetching data on component mount. Group independent requests into `Promise.all` for parallel execution with isolated `.catch` blocks to prevent secondary request failures from suppressing core data, and wrap filtered/sorted list state in `useMemo`.
