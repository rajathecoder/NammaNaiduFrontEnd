## 2025-02-21 - [Optimize Photo Fetching]
**Learning:** The backend `getOppositeGenderProfiles` API payload includes the user's photo information nested in a lowercase `personphoto` array of objects (where `photoplacement` equals 1 for the primary photo, containing `photo1link`). Map this field directly in the frontend state to prevent redundant N+1 fetching via the separate `/api/users/photos` (`GET_PHOTOS`) endpoint.
**Action:** Map the photo directly from the `personphoto` association on the main payload instead of making N+1 queries.
