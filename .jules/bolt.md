## 2024-08-14 - Pre-loaded Nested Associations
**Learning:** The backend getOppositeGenderProfiles API payload already includes the user's photo information nested in a lowercase personphoto array.
**Action:** Map this field directly in the frontend state to prevent redundant N+1 fetching via GET_PHOTOS.
