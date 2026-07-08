## 2024-03-24 - React useMemo array optimization
**Learning:** In React components like Matches, filtering large arrays of objects directly inside the render cycle (e.g. `getFilteredProfiles()`) recalculates the filtered subset on every re-render, blocking the main thread.
**Action:** Wrap derived states from complex arrays (like match lists or search results) in `useMemo` so they are only recalculated when dependencies (`allMatches`, `selectedFilter`) change.

## 2024-03-24 - Parallelizing API Requests
**Learning:** Sequential await chains (network waterfalls) for independent API calls (e.g. fetching matches, then shortlist, then interests) dramatically increases initial load time.
**Action:** Use `Promise.all` to fetch independent data sources concurrently, reducing time-to-glass. Use `.catch()` for secondary requests to prevent non-critical failures from breaking the whole UI.
