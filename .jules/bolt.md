## YYYY-MM-DD - Component Memoization
**Learning:** The MatchCard component is rendered repeatedly in Search, Interests, Matches, and HomePage components, taking in objects and primitives as props but lacks memoization.
**Action:** Add React.memo to heavily reused list-rendering components like MatchCard to avoid unnecessary re-renders when parent states change, especially in long lists.
