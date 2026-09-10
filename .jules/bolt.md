## 2026-09-10 - Eliminate N+1 Query in Profile Photos
**Learning:** The backend `getOppositeGenderProfiles` API includes `personphoto` data directly in its payload, making separate N+1 calls to `/api/users/photos/${id}` for opposite gender profiles redundant and a major frontend performance bottleneck.
**Action:** Map the `photo1link` directly from the nested `personphoto` array in the initial payload to prevent unnecessary network requests.
