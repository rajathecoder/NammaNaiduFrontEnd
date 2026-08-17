## 2025-02-18 - Avoid N+1 requests via Backend Nested Payload
**Learning:** The backend already nests associated data (like `personphoto`) inside the `getOppositeGenderProfiles` response payload. Fetching photos iteratively via `/api/users/photos` creates a massive N+1 fetching bottleneck on the frontend.
**Action:** Always check the initial payload from the backend for nested associations (e.g., `personphoto`) before making redundant separate API requests.
