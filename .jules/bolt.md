## 2026-09-20 - Eliminating N+1 API Calls on Opposite Gender Profiles
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested `personphoto` data directly. Making separate API calls to `/api/users/photos/${id}` for each profile causes an N+1 performance bottleneck on the frontend.
**Action:** Always inspect the primary API payload for nested data before making subsequent API calls to fetch associated entities.
