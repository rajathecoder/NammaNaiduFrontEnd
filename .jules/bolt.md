## 2026-10-04 - Eliminate N+1 API calls for opposite gender profile photos
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested `personphoto` data directly (containing `photoplacement` and `photo1link`). Previously, the frontend was making separate N+1 calls to `/api/users/photos/${id}` for each profile to fetch their photo, which caused severe performance degradation and unnecessary network requests.
**Action:** Extract nested `personphoto` data directly from the profiles list payload rather than making additional API calls.
