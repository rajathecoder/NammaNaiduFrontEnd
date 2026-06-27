## 2024-06-27 - [XSS Vulnerability in CMS Pages via dangerouslySetInnerHTML]
**Vulnerability:** Found `dangerouslySetInnerHTML` being used directly with `page.content` in `src/pages/CMS/ContentPage.tsx`, `src/pages/CMS/ContactUs.tsx`, and `src/admin/pages/CMS/CMSPage.tsx` without sanitization. This is a critical XSS vulnerability since CMS content is typically dynamic and could contain malicious scripts.
**Learning:** The frontend assumes the backend provides clean, sanitized HTML, but defense-in-depth requires sanitizing on the client-side as well before injecting into the DOM, especially since the admin portal allows entering arbitrary HTML.
**Prevention:** Always use a sanitization library like `DOMPurify` before injecting dynamic content with `dangerouslySetInnerHTML`.
