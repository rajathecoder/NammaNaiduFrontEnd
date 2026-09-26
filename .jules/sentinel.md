## 2026-09-26 - DOMParser Sanitization Bypasses
**Vulnerability:** XSS through dangerouslySetInnerHTML in CMS components via bypassable input checks.
**Learning:** Basic regex or string prefix checking for `javascript:` fails because browsers ignore whitespace and HTML entities in protocols, and data: URIs can execute JS when parsed as SVG or HTML inside elements like iframe.
**Prevention:** Explicitly strip all inline event handlers (on*), strip the srcdoc attribute on iframes, trim and evaluate entities by setting intermediate textarea HTML, and reject data:, javascript:, and vbscript: schemas in URI attributes.
