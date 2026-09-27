## 2026-09-27 - Eliminate N+1 API calls for opposite gender photos
**Learning:** The backend getOppositeGenderProfiles API payload includes nested personphoto data directly, making separate N+1 calls to fetch profile photos unnecessary.
**Action:** Extract nested personphoto data directly from the getOppositeGenderProfiles payload to improve page load time and reduce network requests.
