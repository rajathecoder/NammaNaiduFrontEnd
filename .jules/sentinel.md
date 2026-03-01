## 2024-05-30 - [XSS via dangerouslySetInnerHTML in CMS Pages]
**Vulnerability:** Found unsanitized HTML being rendered directly using `dangerouslySetInnerHTML` in `CMSPage.tsx`, `ContentPage.tsx`, and `ContactUs.tsx`.
**Learning:** CMS content is inherently untrusted, and rendering it raw opens up XSS vulnerabilities if an admin account is compromised or malicious input slips into the database.
**Prevention:** Created a `SanitizedHTML` component that wraps `dompurify` to sanitize HTML content before rendering it. This component should be used universally for rendering CMS content.
