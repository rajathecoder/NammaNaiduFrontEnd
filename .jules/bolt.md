## 2026-06-17 - Optimize Array Filtering in React Component
**Learning:** When optimizing array filtering in React, extract invariant operations (like static `new Date()` instantiations or `.toLowerCase()` transformations) outside of the `.filter()` loop to prevent redundant object/string allocations and operations per iteration.
**Action:** Extract 'const fiveDaysAgo = new Date(); fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);' outside of the map/filter logic or use useMemo.
