## 2026-09-18 - Fix N+1 Photo API Calls
**Learning:** The frontend made N+1 API calls to fetch profile photos on the home page even though the backend already nested the `personphoto` data directly inside the `getOppositeGenderProfiles` response.
**Action:** Always check the payload structure of the main API response before introducing follow-up queries. Extracted the data directly from the parent payload.
