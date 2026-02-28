## 2025-02-28 - React.memo Optimization
**Learning:** Found MatchCard components mapped in lists inside HomePage, Matches, Interests and Search pages without memoization. Given MatchCard accepts primitive props and functions, this is a prime candidate for `React.memo` to prevent unnecessary re-renders when parent lists update.
**Action:** Add `React.memo` to the MatchCard component to prevent unnecessary re-renders of list items. Use `useCallback` in parent components for handler props to maximize memoization benefits.
