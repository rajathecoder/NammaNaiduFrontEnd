## 2024-05-20 - N+1 Request Fix in HomePage

**Learning:** An N+1 API request problem existed when rendering `oppositeGenderProfiles` on `HomePage.tsx`. Rather than making separate `fetch` calls to `API_ENDPOINTS.USERS.GET_PHOTOS` for each profile inside a `map`, the backend already includes this data under `profile.personPhoto.photo1` within the original response. Relying on this association eliminates `N` unnecessary network requests during component mount.
**Action:** Always inspect the payload of aggregate responses (like lists of profiles) to see if associated data is already joined before resorting to looping and fetching individual detail endpoints.
