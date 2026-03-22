## 2024-03-01 - XSS Vulnerability in CMS Pages
**Vulnerability:** Multiple CMS pages (`CMSPage.tsx`, `ContentPage.tsx`, `ContactUs.tsx`) were rendering dynamic HTML content fetched from the backend using the unsafe `dangerouslySetInnerHTML` React prop without any prior sanitization.
**Learning:** This exposes the application to severe Cross-Site Scripting (XSS) attacks if a malicious actor successfully injects script tags into the CMS database. Any unvalidated rich text content must be treated as untrusted data.
**Prevention:** Always use a client-side HTML sanitizer like `dompurify` when rendering dynamic HTML. Created a reusable `SanitizedHTML` component to enforce this pattern globally across the codebase.
