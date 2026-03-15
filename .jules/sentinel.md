## 2024-05-18 - XSS Risk in CMS Pages
**Vulnerability:** Found `dangerouslySetInnerHTML` being used directly to render raw `content` fetched from APIs or user inputs in `CMSPage.tsx`, `ContentPage.tsx`, and `ContactUs.tsx`.
**Learning:** React provides `dangerouslySetInnerHTML` for a reason, but using it directly on API-fetched content without sanitization invites Cross-Site Scripting (XSS) attacks, especially in CMS platforms where content can be manipulated.
**Prevention:** Created a central `SanitizedHTML` component using `dompurify` to sanitize all dynamic HTML before rendering. Enforce using this component instead of raw `dangerouslySetInnerHTML`.
