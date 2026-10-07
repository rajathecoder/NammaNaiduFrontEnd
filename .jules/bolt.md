## 2025-02-12 - Eliminate N+1 API Calls for Profile Photos
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested `personphoto` data directly. Making separate N+1 calls to `/api/users/photos/${id}` is unnecessary and creates a massive performance bottleneck on pages loading multiple profiles.
**Action:** Always check the payload of list endpoints to see if related resources (like profile photos or status flags) are already embedded before building generic N+1 fetch loops.
