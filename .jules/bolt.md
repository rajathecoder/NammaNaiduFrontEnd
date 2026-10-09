## 2024-05-18 - Eliminated N+1 queries for profile photos
**Learning:** The backend `getOppositeGenderProfiles` API payload includes nested profile photos directly, making separate N+1 calls to `/api/users/photos/${id}` unnecessary for fetching opposite gender profile photos.
**Action:** Extract `photo1link` directly from `profile.personPhoto?.photo1` or `profile.personphoto` (where `photoplacement === 1`) in the payload.
