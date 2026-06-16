## 2024-06-16 - Cross-Site Scripting (XSS) via dangerouslySetInnerHTML
**Vulnerability:** The CMS content pages (`src/pages/CMS/ContentPage.tsx`, `src/pages/CMS/ContactUs.tsx`, `src/admin/pages/CMS/CMSPage.tsx`) render raw HTML via `dangerouslySetInnerHTML` without proper sanitization.
**Learning:** Using `dangerouslySetInnerHTML` exposes the app to Cross-Site Scripting (XSS) if the source data is compromised. In our case, the backend serves the CMS content but any malicious injection by an admin (or a backend flaw) would be immediately executed in the user's browser.
**Prevention:** Always sanitize any dynamic HTML content before injecting it into the DOM. We should use `dompurify` and implement a central sanitization utility to wrap all `dangerouslySetInnerHTML` calls.
