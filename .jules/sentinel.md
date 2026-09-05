## 2024-05-18 - CMS XSS Vulnerability & Sanitizer Fallback
**Vulnerability:** XSS via `dangerouslySetInnerHTML` in CMS pages.
**Learning:** Implemented a custom fallback DOMParser sanitizer because the codebase lacked DOMPurify, prioritizing the "Ask first" boundary over adding unauthorized dependencies. The initial sanitizer had a bypass via whitespace in URI schemes (e.g., `<a href=" javascript:alert(1)">`).
**Prevention:** When implementing a fallback custom sanitizer, ensure whitespace parsing is handled robustly (e.g., `trim()` before `startsWith()`).
