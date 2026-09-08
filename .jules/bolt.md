## 2026-09-08 - Eliminate N+1 queries for profile photos
**Learning:** The getOppositeGenderProfiles backend API already includes nested photo arrays (personphoto) for each profile, making separate GET_PHOTOS calls for every profile a redundant N+1 bottleneck.
**Action:** Map the pre-fetched nested association data directly on the frontend instead of iterating and dispatching separate requests.
