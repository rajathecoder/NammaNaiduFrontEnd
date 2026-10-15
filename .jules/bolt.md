## 2026-10-15 - [Prevent N+1 API Calls for Profile Photos]
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested profile photos directly (either as a `personphoto` array containing objects with `photoplacement` and `photo1link`, or as a `personPhoto` object with `photo1`), making separate N+1 calls to `/api/users/photos/${id}` unnecessary for fetching profile photos.
**Action:** Extract nested relations from the initial payload rather than fetching them individually.
