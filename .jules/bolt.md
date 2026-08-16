## 2024-08-16 - Memoize filteredProfiles array
**Learning:** `filteredProfiles` was being recalculated on every render inside `Matches.tsx`, potentially causing performance issues when filtering a large number of profiles.
**Action:** Use `useMemo` to memoize the array returned by `getFilteredProfiles()`, only recalculating it when `allMatches` or `selectedFilter` change. This prevents unnecessary computation on every render.
