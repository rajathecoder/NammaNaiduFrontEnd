## 2025-02-23 - XSS in CMS Pages
**Vulnerability:** XSS in CMS pages (`dangerouslySetInnerHTML` was used without sanitization).
**Learning:** `dangerouslySetInnerHTML` was used without DOMPurify for CMS content in `ContactUs.tsx`, `ContentPage.tsx`, and `CMSPage.tsx`.
**Prevention:** Always use `DOMPurify.sanitize` with `dangerouslySetInnerHTML`.
