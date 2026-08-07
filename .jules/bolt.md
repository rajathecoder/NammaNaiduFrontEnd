## 2026-08-07 - Prevent N+1 API Calls
**Learning:** Found an N+1 query issue in the frontend where `getOppositeGenderProfiles` was iterating over users to fetch their photos via an additional API endpoint for each user.
**Action:** Replaced the separate network fetches in `HomePage.tsx` and `useHomePageData.ts` with a direct lookup on the `personPhoto.photo1` property that is already nested within the initial API payload. This completely eliminates N+1 calls and significantly speeds up rendering of matching profiles.
