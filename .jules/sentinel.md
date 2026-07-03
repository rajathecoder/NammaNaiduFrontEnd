## 2025-07-03 - [Fix XSS in CMS Pages]
**Vulnerability:** XSS vulnerability found in CMS pages (`ContentPage`, `ContactUs`, and `CMSPage`) via unescaped `dangerouslySetInnerHTML`.
**Learning:** React's `dangerouslySetInnerHTML` passes raw HTML directly to the DOM, exposing a high-risk vector if user-provided content isn't sanitized first. Since this is an SPA that supports SSR components, using `DOMPurify` natively must be wrapped in a `typeof window !== 'undefined'` check to prevent errors since it relies on the DOM.
**Prevention:** Always wrap variables passed to `dangerouslySetInnerHTML` with `DOMPurify.sanitize()` using a safe wrapper like `sanitizeHTML`.
