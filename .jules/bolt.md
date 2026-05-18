## 2024-12-16 - Memoization of Matches array filtering
**Learning:** Found a case where `allMatches.filter` was re-running on every render due to being executed as a regular function, particularly causing re-computations during pagination changes.
**Action:** Always wrap expensive list filtering logic in `useMemo` specifically when pagination relies on the filtered output, so that slicing the page array doesn't unnecessarily trigger a full re-filter of the source array.
