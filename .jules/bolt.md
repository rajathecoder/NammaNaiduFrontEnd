
## 2026-05-31 - [Extracting Invariant Transformations from React array `.filter` Loops]
**Learning:** React component re-renders often contain redundant per-iteration recalculations inside list processing methods (like `.filter()`). For instance, executing `.toLowerCase()` on a stable `searchTerm` state *inside* a `users.filter()` callback dynamically creates a new string mapping for every user in the array on every render pass.
**Action:** Always extract invariant state transformations (like lowering cases or instantiating Date objects) outside of the `.filter`/`.map` loop block. This changes an O(N) allocation/transformation operation into an O(1) operation prior to the loop.
