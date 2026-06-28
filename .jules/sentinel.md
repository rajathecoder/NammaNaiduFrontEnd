## 2024-05-30 - Prevent XSS in CMS Rendering
**Vulnerability:** Use of raw `dangerouslySetInnerHTML` with unsanitized dynamic content from external CMS sources in React components (`ContentPage`, `ContactUs`, `CMSPage`).
**Learning:** Even internal CMS sources can be vulnerable if admins are compromised or payloads are embedded. React does not sanitize `dangerouslySetInnerHTML` by default.
**Prevention:** Always wrap dynamically sourced HTML payloads in a secure sanitization library like `dompurify` before passing them to `dangerouslySetInnerHTML`.
