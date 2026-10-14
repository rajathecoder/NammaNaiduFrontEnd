## 2024-05-18 - XSS in dangerouslySetInnerHTML
**Vulnerability:** Found uses of dangerouslySetInnerHTML rendering raw CMS content without any sanitization in src/pages/CMS/ContentPage.tsx, src/pages/CMS/ContactUs.tsx, and src/admin/pages/CMS/CMSPage.tsx.
**Learning:** The frontend assumes the backend provides clean, safe HTML, which is a significant XSS risk if the CMS input validation is bypassed or if a malicious admin injects scripts.
**Prevention:** Implement a custom HTML sanitizer (using DOMParser) per the memory rules (allowing specific tags and rejecting inline event handlers and data:/javascript: URIs), then wrap all CMS content passed to dangerouslySetInnerHTML with this sanitizer function.
