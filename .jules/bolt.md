## 2026-09-11 - Prevent N+1 API Calls for Profile Photos
**Learning:** The backend returns nested `personphoto` data in the main profiles API, making separate photo API calls per profile redundant and inefficient.
**Action:** Avoid N+1 queries by extracting photo links from the initial API payload instead of making individual requests.
