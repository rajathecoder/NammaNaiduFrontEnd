## 2025-05-24 - N+1 Query Elimination in Profiles
**Learning:** The getOppositeGenderProfiles backend API payload already includes nested personphoto data directly, rendering separate N+1 calls to /api/users/photos/${id} redundant and severely impacting frontend performance.
**Action:** Always inspect the primary API payload structure for nested entities before implementing secondary fetch loops for related data.
