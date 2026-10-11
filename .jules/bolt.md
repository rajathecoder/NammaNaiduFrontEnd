## 2025-05-15 - [Avoid N+1 fetch calls by using nested profile photos]
**Learning:** The `getOppositeGenderProfiles` backend response already includes profile photos inside a `personphoto` array (or `personPhoto` object). Calling `/api/users/photos/${id}` inside a map is redundant and results in N+1 network requests during loading of multiple profiles.
**Action:** Extract photo information from the profile object directly instead of making an API call per profile.
