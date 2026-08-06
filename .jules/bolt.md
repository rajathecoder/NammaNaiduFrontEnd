
## 2026-08-06 - Prevent N+1 Profile Photo Fetching
**Learning:** The backend `getOppositeGenderProfiles` API payload already includes the user's primary photo link nested at `personPhoto.photo1`. Fetching it again via `/api/users/photos` creates redundant N+1 requests.
**Action:** Map the photo directly from the nested payload object when available to prevent unnecessary API calls and improve frontend load times.
