## 2026-06-18 - XSS Vulnerabilities in CMS Rendering
**Vulnerability:** User-generated or dynamic CMS content was directly injected into the DOM using `dangerouslySetInnerHTML` without proper sanitization.
**Learning:** Native React protections are bypassed by `dangerouslySetInnerHTML`. Falling back to naive or custom Regex/DOMParser sanitizers is insecure.
**Prevention:** Always use established libraries like `dompurify` and handle SSR edge cases gracefully (checking for the `window` object) before exposing dynamic HTML content.
