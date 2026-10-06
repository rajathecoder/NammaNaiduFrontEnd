## 2025-02-28 - Eliminate N+1 API calls for opposite-gender profile photos
**Learning:** The backend getOppositeGenderProfiles API payload already includes nested personphoto data directly (containing photoplacement and photo1link). Making separate N+1 calls to /api/users/photos/${id} is unnecessary and causes a performance bottleneck on the homepage.
**Action:** Always inspect the payload structure of API responses before making subsequent requests to fetch related data.
