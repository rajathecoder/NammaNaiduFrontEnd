## 2025-02-23 - Prevent XSS in dynamically rendered CMS content
**Vulnerability:** CMS page content rendered via `dangerouslySetInnerHTML` directly without sanitization.
**Learning:** Even though content comes from a trusted CMS backend, storing unsanitized HTML presents a cross-site scripting (XSS) risk if an attacker compromises the backend or if admin users accidentally insert malicious scripts. Implementing a browser-only sanitization utility correctly with an SSR fallback is crucial.
**Prevention:** Always wrap variables passed into `dangerouslySetInnerHTML` with `sanitizeHTML` powered by a reputable library like `DOMPurify`, ensuring SSR compatibility by safely returning an empty string when `window` is undefined.
