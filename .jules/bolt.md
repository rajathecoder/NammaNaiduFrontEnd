## 2024-05-18 - [Eliminate N+1 API calls for opposite gender profile photos]
**Learning:** The frontend made a separate API call for each profile fetched in getOppositeGenderProfiles to retrieve their photo. However, the getOppositeGenderProfiles endpoint already includes photo data nested within a `personphoto` array in the response payload.
**Action:** Always check the payload of collection endpoints to see if associations (like photos) are already included before dispatching subsequent N+1 API calls.
