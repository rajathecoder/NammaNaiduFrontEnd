## 2025-05-18 - Avoid N+1 API Calls for Profile Photos
**Learning:** The backend \`getOppositeGenderProfiles\` API returns profile data that already includes photo links under \`personPhoto.photo1\` (or similar nested property, depending on exact shape which we know from the Matches page code). We do not need to make N+1 API calls to \`/api/users/photos/\${id}\` for every profile in the list.
**Action:** Extract photo links directly from the profile objects returned by \`getOppositeGenderProfiles\` instead of making separate API calls for each profile.
