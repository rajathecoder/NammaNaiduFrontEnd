## 2026-03-14 - DOMPurify for XSS Mitigation
**Vulnerability:** XSS vulnerability through usage of `dangerouslySetInnerHTML` in CMS content rendering (ContentPage, ContactUs, CMSPage).
**Learning:** Rendering user-generated or external CMS content directly using `dangerouslySetInnerHTML` allows for potential XSS attacks if the content is malicious.
**Prevention:** Always sanitize HTML content before rendering it. Introduced a reusable `SanitizedHTML` component that uses `DOMPurify` to sanitize HTML output, stripping dangerous tags (`<script>`, `<style>`, `<iframe>`, etc.) and event handlers (`onerror`, `onload`, etc.).
