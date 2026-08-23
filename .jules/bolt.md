## 2025-03-01 - [Avoid N+1 photo fetching]
**Learning:** The getOppositeGenderProfiles API already returns nested personphoto arrays.
**Action:** Map photo directly from the frontend state to avoid N+1 GET_PHOTOS requests.
