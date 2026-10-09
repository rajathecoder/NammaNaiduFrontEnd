## 2026-10-09 - Custom HTML Sanitizer
**Vulnerability:** XSS vulnerability through dangerouslySetInnerHTML used for CMS content.
**Learning:** Implementing a custom sanitizer requires explicit removal of whitespace/control characters before validating URI schemes (to prevent java\x09script: bypasses), explicit blocking of data: schemes and srcdoc attributes, and 'fail secure' SSR guards.
**Prevention:** Use the sanitizeHtml utility for all CMS and user inputs, and always validate full URL schemes instead of basic string prefixes.
