## 2026-09-22 - Prevent N+1 query loop on HomePage
**Learning:** The backend getOppositeGenderProfiles API includes nested personphoto data directly, making separate N+1 calls to /api/users/photos/${id} inside a Promise.all completely redundant and a major frontend bottleneck.
**Action:** Always inspect the primary API payload for nested data arrays before implementing sequential or concurrent chained fetches for related resources.
