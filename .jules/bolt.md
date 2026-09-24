## 2026-09-24 - Eliminate N+1 API Calls for Profile Photos
**Learning:** The backend getOppositeGenderProfiles API payload directly includes nested personphoto data, making separate N+1 calls to fetch profile photos unnecessary.
**Action:** Extract photo links directly from the nested payload instead of making separate API calls for each profile.
