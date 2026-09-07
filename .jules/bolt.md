## 2025-02-21 - Eliminate N+1 calls
**Learning:** The backend getOppositeGenderProfiles API payload includes the user's photo information nested in a lowercase personphoto array, which can be mapped directly.
**Action:** Use the personphoto array from the initial payload instead of fetching photos individually to prevent redundant N+1 API calls.
