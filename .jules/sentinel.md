## 2023-10-25 - Custom HTML Sanitizer for CMS
**Vulnerability:** XSS through dangerouslySetInnerHTML.
**Learning:** Basic string replacements bypass easily (e.g. whitespace before protocol). Needed a strict DOMParser allowlist approach stripping 'on*' handlers and checking URI protocols via URL API correctly.
**Prevention:** Use sanitizeHtml wrapping all dynamically rendered HTML content.
