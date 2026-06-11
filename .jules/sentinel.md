## 2025-02-27 - XSS Vulnerability in CMS Pages via dangerouslySetInnerHTML
**Vulnerability:** The application was directly rendering unsanitized HTML content from an API using `dangerouslySetInnerHTML` in multiple CMS components (`ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx`).
**Learning:** Even if the API is considered "trusted", rendering dynamic HTML without sanitization opens the door for stored XSS attacks if the database or CMS admin panel is ever compromised or manipulated.
**Prevention:** Always wrap dynamically loaded HTML with a reliable sanitization library (like DOMPurify) before rendering it with `dangerouslySetInnerHTML`. Create a centralized utility to handle this to ensure consistency and prevent regression.
