## 2026-09-16 - Eliminate N+1 profile photo queries
**Learning:** The backend `getOppositeGenderProfiles` API payload directly includes nested `personphoto` data (containing `photoplacement` and `photo1link`). Fetching photos via N+1 calls to `/api/users/photos/${id}` is redundant.
**Action:** Extract photo links directly from the profile payload instead of firing separate requests for each user.
