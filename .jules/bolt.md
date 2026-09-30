## 2023-11-20 - N+1 API Calls
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested `personphoto` data directly (containing `photoplacement` and `photo1link`), making separate N+1 calls to `/api/users/photos/${id}` unnecessary for fetching profile photos.
**Action:** Extract photo links from the provided payload instead of making redundant network requests.
