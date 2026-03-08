## 2024-05-24 - [CRITICAL] Prevented XSS in CMS Rendering
**Vulnerability:** CMS page contents (e.g., ContactUs, ContentPage, CMSPage) were rendering arbitrary HTML directly via `dangerouslySetInnerHTML`. This exposed the application to high-severity Cross-Site Scripting (XSS) if any malicious scripts were injected into the CMS content database.
**Learning:** Directly passing dynamic data into React's `dangerouslySetInnerHTML` is extremely dangerous and bypasses React's built-in XSS protections.
**Prevention:** Introduced a `SanitizedHTML` reusable component powered by `dompurify`. All raw HTML rendering MUST pass through `DOMPurify.sanitize()` before being executed in the DOM.
