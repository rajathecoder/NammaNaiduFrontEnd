## 2024-05-25 - XSS via dangerouslySetInnerHTML
**Vulnerability:** Found `dangerouslySetInnerHTML` usage in CMS pages without any HTML sanitization.
**Learning:** CMS content loaded from API requires strict HTML sanitization before rendering in React to prevent XSS.
**Prevention:** Always use `dompurify` to sanitize HTML content from external sources before passing it to `dangerouslySetInnerHTML`.
