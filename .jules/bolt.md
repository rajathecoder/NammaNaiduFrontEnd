## 2024-07-04 - Promise.all requires fault-tolerance
**Learning:** When refactoring sequential API calls to concurrent `Promise.all` arrays (e.g. fetching main profile data alongside secondary interaction states like shortlists/interests), a single failed request will reject the entire array and break the UI.
**Action:** Always append `.catch()` blocks to the individual promises inside `Promise.all` to maintain fault tolerance, ensuring partial data can still render successfully.
