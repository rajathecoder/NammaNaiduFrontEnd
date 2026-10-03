## 2026-10-03 - XSS Vulnerability in CMS Content
**Vulnerability:** Unsanitized HTML rendering via dangerouslySetInnerHTML in CMS pages.
**Learning:** Passing raw HTML content from backend directly into dangerouslySetInnerHTML without sanitization allows Stored XSS attacks, specifically when parsing nested attributes and custom tags. DOMParser requires checking for control characters and whitespace embedded in URL protocols to prevent bypasses.
**Prevention:** Always sanitize dynamic HTML content using an allowlist approach for tags and attributes on the client-side (and backend), explicitly rejecting 'javascript:', 'data:' URIs, 'srcdoc', and 'on*' event handlers. In SSR setups, fail securely before hydration.
