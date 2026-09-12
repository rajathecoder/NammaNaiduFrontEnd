## 2026-09-12 - XSS via dangerouslySetInnerHTML
**Vulnerability:** Unsanitized user-supplied HTML content passed directly to `dangerouslySetInnerHTML` in CMS pages.
**Learning:** Relying on basic DOMParser sanitization without accounting for unicode replacement characters (�) and whitespace can lead to javascript: URI bypasses.
**Prevention:** Implement strict tag/attribute allowlists, trim attribute values before scheme validation, and rigorously strip control and replacement characters.
