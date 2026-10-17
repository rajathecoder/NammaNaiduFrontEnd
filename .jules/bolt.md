## 2023-10-17 - Eliminate N+1 profile photo fetching
**Learning:** The backend getOppositeGenderProfiles API payload includes nested profile photos directly, making separate N+1 calls to /api/users/photos/${id} unnecessary.
**Action:** Extract nested profile photos directly from the UserProfile response payload to avoid redundant API requests.
