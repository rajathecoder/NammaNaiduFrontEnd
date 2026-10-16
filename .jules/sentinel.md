## 2024-10-16 - XSS Vulnerability in CMS Pages
**Vulnerability:** CMS page content is rendered using `dangerouslySetInnerHTML` directly from the API response without any sanitization in `src/pages/CMS/ContentPage.tsx`, `src/pages/CMS/ContactUs.tsx`, and `src/admin/pages/CMS/CMSPage.tsx`. This allows malicious scripts to be executed.
**Learning:** `dangerouslySetInnerHTML` should never be used without a sanitizer, especially when rendering data that comes from a database or CMS.
**Prevention:** Always sanitize HTML content before rendering it using a custom sanitizer or library like DOMPurify. I created a custom sanitizer at `src/utils/security/sanitizeHtml.ts`.
