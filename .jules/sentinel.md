
## 2024-05-24 - Fix XSS Vulnerabilities in CMS Pages
**Vulnerability:** Found `dangerouslySetInnerHTML` being used to render raw, un-sanitized content fetched directly from a CMS endpoint in `ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx`.
**Learning:** This existed because the codebase lacked a central, safe way to render dynamic HTML content, leading developers to use `dangerouslySetInnerHTML` directly without considering XSS implications.
**Prevention:** Always use a sanitization library like `dompurify` when rendering dynamic HTML. Created a reusable `SanitizedHTML` component (`src/components/common/SanitizedHTML.tsx`) to enforce this pattern globally.
