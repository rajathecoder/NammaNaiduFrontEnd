## 2024-06-15 - [XSS via CMS Content Rendering]
**Vulnerability:** Unsanitized HTML content fetched from the CMS API was rendered directly using `dangerouslySetInnerHTML` in `ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx`, exposing the application to Cross-Site Scripting (XSS) attacks.
**Learning:** External content, even from an internal CMS API, must always be treated as untrusted and potentially malicious. Using `dangerouslySetInnerHTML` without proper sanitization allows arbitrary script execution if the content is compromised.
**Prevention:** Always sanitize dynamic HTML content using established libraries like `DOMPurify` before passing it to `dangerouslySetInnerHTML`. Created a reusable `sanitizeHTML` utility to enforce this practice consistently across the application.
