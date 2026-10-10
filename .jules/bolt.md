## 2025-05-18 - Avoid N+1 API Calls for Profile Photos
**Learning:** The backend API endpoint for opposite-gender profiles already includes nested profile photos directly, rendering separate N+1 calls to fetch individual user photos unnecessary.
**Action:** Extract photo links directly from the nested 'personPhoto' or 'personphoto' objects returned by the primary profile query.
