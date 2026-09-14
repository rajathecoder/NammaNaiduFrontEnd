## 2026-09-14 - Eliminate N+1 API calls
**Learning:** The frontend makes N+1 API calls to fetch profile photos even though the backend payload for `getOppositeGenderProfiles` already includes nested `personphoto` data.
**Action:** Replaced the N+1 API calls with direct mapping of the nested `personphoto` data.
