## 2024-05-24 - Network Waterfalls in Component Mounting
**Learning:** Sequential await calls in React `useEffect` hooks cause significant network waterfalls, especially when multiple independent data sources (like opposite-gender profiles, shortlist actions, and interest actions) are fetched on component mount.
**Action:** Always evaluate if API calls in a `useEffect` are truly dependent on each other. If not, bundle them in a `Promise.all` with individual `.catch()` blocks for fault tolerance to speed up the initial rendering phase.
