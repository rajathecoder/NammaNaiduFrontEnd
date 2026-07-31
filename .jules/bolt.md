## 2025-02-12 - N+1 Query Optimization in Profile Fetching
**Learning:** Found an N+1 API call pattern where each profile fetched required a separate request to fetch their photos, even though the photo data (`personPhoto`) was already included in the initial `getOppositeGenderProfiles` API response.
**Action:** Always check the payload of the initial API response before making subsequent requests. By mapping pre-included associations (e.g. `personPhoto.photo1`), we can completely eliminate the N+1 API calls and significantly improve page load time.
