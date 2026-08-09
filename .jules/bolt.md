## 2025-08-09 - N+1 Issue on HomePage
**Learning:** Found N+1 fetch issue for photos on HomePage where `fetch` was called for each opposite gender profile, but the backend payload already included the photo information under `personphoto`.
**Action:** Replaced the Promise.all individual fetches with mapping from the initial payload's `personphoto` array.
