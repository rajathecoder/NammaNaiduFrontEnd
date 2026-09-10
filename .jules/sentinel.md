## 2026-09-10 - CMS Stored XSS Mitigation
**Vulnerability:** XSS vulnerability found in CMS pages using dangerouslySetInnerHTML without sanitization.
**Learning:** Trusting user-provided CMS content directly in HTML exposes the site to Stored XSS.
**Prevention:** Always sanitize HTML input on the client using a strict allowlist before rendering.
