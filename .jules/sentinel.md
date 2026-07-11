## 2026-07-11 - Fixed XSS vulnerability in CMS pages
**Vulnerability:** Multiple CMS pages (`CMSPage.tsx`, `ContactUs.tsx`, `ContentPage.tsx`) were using `dangerouslySetInnerHTML` to render un-sanitized HTML content coming from the API backend.
**Learning:** React's `dangerouslySetInnerHTML` bypasses the built-in XSS protections and allows executing arbitrary scripts if the input string contains malicious `<script>` tags or `onerror` handlers in image tags.
**Prevention:** Whenever rendering HTML natively using `dangerouslySetInnerHTML`, the input MUST be wrapped in a sanitization function like `DOMPurify.sanitize()` first to strip malicious handlers and elements, even if the content originates from an administrative or "trusted" source (as the backend could also be compromised).
