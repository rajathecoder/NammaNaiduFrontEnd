## 2025-01-20 - Eliminated N+1 API Calls for Profile Photos
**Learning:** The getOppositeGenderProfiles API payload includes nested photo information in a lowercase personphoto array, but the frontend was making an N+1 API request to /api/users/photos for every profile to fetch the same data.
**Action:** Always check the initial API payload for nested associations before assuming separate network requests are necessary, as mapping existing nested data drastically reduces load times.
