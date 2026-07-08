## 2026-07-08 - XSS Vulnerability in CMS Pages
**Vulnerability:** Unsanitized HTML rendering via `dangerouslySetInnerHTML` in CMS pages (`ContentPage.tsx`, `ContactUs.tsx`, `CMSPage.tsx`).
**Learning:** CMS content is fetched from an API and rendered directly into the DOM using `dangerouslySetInnerHTML`. This is a classic Cross-Site Scripting (XSS) vulnerability. An attacker who can inject malicious scripts into the CMS content could execute arbitrary code in the context of the user's browser.
**Prevention:** Always sanitize HTML content before rendering it using a library like `DOMPurify`.
