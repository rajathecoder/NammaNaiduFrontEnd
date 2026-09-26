## 2024-05-24 - N+1 Photo Fetch Optimization
**Learning:** The backend API for opposite-gender-profiles already includes nested `personphoto` data, but the frontend was still making separate API requests to `/api/users/photos/${id}` for each profile, causing a severe N+1 performance bottleneck.
**Action:** Always check the initial API payload for nested data before making additional dependent network requests for related entities.
