## 2024-05-20 - Backend Profile Payload Includes Nested Photos
**Learning:** The `/api/users/opposite-gender-profiles` backend endpoint eagerly loads user photos nested under the `personphoto` array. The frontend was unnecessarily making N+1 API calls to `/api/users/photos` for each user.
**Action:** Always inspect the raw backend payload for nested associations before implementing N+1 fetch loops, as the backend may already be eagerly loading the required data.
