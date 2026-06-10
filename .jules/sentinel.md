## 2025-02-15 - [CRITICAL] Prevent XSS vulnerabilities in CMS pages
**Vulnerability:** Raw HTML from the server and local text input was being passed directly to `dangerouslySetInnerHTML` in `ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx`, enabling Cross-Site Scripting (XSS) attacks.
**Learning:** React escapes text inputs, but not when `dangerouslySetInnerHTML` is used. Using this inherently trusts the source. We must sanitize ANY HTML string before parsing it. A simple regex isn't enough, we need to use a DOM parser.
**Prevention:** Always use `dompurify` (e.g., via the `sanitizeHTML` helper) around `dangerouslySetInnerHTML` payload data, even for trusted backend CMS payloads or preview environments.
