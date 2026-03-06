## 2026-03-06 - [DOMPurify for XSS Protection in CMS Content]
**Vulnerability:** Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML` in CMS components (`CMSPage`, `ContentPage`, `ContactUs`).
**Learning:** Raw HTML content from the CMS was being directly injected into the DOM without sanitization, creating a significant XSS risk if the CMS content was ever compromised or contained malicious scripts.
**Prevention:** Created a reusable `SanitizedHTML` component that uses `dompurify` to sanitize all HTML strings before they are rendered using `dangerouslySetInnerHTML`. All instances of raw `dangerouslySetInnerHTML` usage were replaced with this secure component.
