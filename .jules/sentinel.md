## 2026-10-08 - Custom HTML Sanitizer
**Vulnerability:** XSS via poorly sanitized dangerouslySetInnerHTML content in CMS
**Learning:** When sanitizing, data: URI, javascript: URI and srcdoc can bypass naive substring checks. Embedded whitespace in URIs requires control character stripping (e.g. /[\x00-\x1F\s]/g).
**Prevention:** Rely on strong sanitizer function filtering dangerous attributes (e.g., starting with 'on') and fully removing non-standard whitespaces before scanning for forbidden URI prefixes.
