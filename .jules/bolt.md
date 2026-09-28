## 2025-01-30 - [N+1 Optimization]
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested `personphoto` data directly (containing `photoplacement` and `photo1link`), making separate N+1 calls to `/api/users/photos/${id}` unnecessary for fetching profile photos.
**Action:** Extract photo data directly from the nested payload instead of making subsequent API calls.
