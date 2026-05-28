## 2026-05-28 - Avoid O(N) recalculations for list filtering

**Learning:** Component `src/pages/Matches/Matches.tsx` was executing its `getFilteredProfiles` function linearly on every render, which included O(N) array filtering and continuous instantiation of `Date` objects inside the filter closure when applying 'newly-joined' sorting.

**Action:** Extracted the entire computation to a `useMemo` block that only recalculates when `allMatches` or `selectedFilter` change, avoiding thousands of unnecessary function calls per render cycle. In the future, ensure array sorting and complex filtering of lists are always bound to `useMemo` hooks.
