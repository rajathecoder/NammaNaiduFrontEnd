## 2025-02-14 - CMS XSS Vulnerability Fix
**Vulnerability:** XSS risk in CMS pages (`ContentPage.tsx`, `ContactUs.tsx`, `CMSPage.tsx`) using `dangerouslySetInnerHTML` directly on user-provided content.
**Learning:** Found that we can mitigate XSS risks effectively without adding external dependencies (like `dompurify`) by using the browser's native `DOMParser` to create a lightweight custom HTML sanitizer. This is crucial for avoiding dependency bloat in lightweight projects while maintaining security.
**Prevention:** Always wrap `dangerouslySetInnerHTML` inputs with a sanitizer. In environments where bundle size matters or adding dependencies requires approval, consider writing a native `DOMParser`-based sanitizer for basic HTML sanitization needs.
