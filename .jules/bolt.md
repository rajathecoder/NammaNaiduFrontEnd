## 2024-09-06 - [Eliminate N+1 API Calls for Profile Photos]
**Learning:** [Discovered a critical codebase-specific architectural bottleneck where the frontend makes an N+1 API call for every profile fetched to `/api/users/photos`, despite the primary photo being already included in the `personphoto` array in the parent payload.]
**Action:** [Map the `personphoto` field directly in the frontend state from the parent payload to prevent redundant N+1 fetching via the separate `/api/users/photos` endpoint.]
