## YYYY-MM-DD - [Title]
**Vulnerability:** [What you found]
**Learning:** [Why it existed]
**Prevention:** [How to avoid next time]
## 2025-06-03 - [HIGH] Fix XSS Vulnerability in CMS Pages
**Vulnerability:** Found unsanitized HTML being injected via `dangerouslySetInnerHTML` in multiple CMS components.
**Learning:** Using `dangerouslySetInnerHTML` directly with user/admin-provided content is an XSS vector.
**Prevention:** Always use `dompurify` to sanitize HTML content before rendering it in React.
