## 2024-05-18 - Fix missing HTML Sanitizer in CMS Pages
**Vulnerability:** XSS vulnerability identified in `ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx` due to the direct use of `dangerouslySetInnerHTML` without any input sanitization.
**Learning:** The project was missing a dedicated sanitizer utility (like `DOMPurify`). Because of strict dependency rules, an unapproved third-party package could not be added, which left the CMS rendered content exposed to injected script executions.
**Prevention:** Always implement a native `DOMParser` sanitization utility for `dangerouslySetInnerHTML` rendering when third-party libraries aren't available, ensuring fallback regex handling for non-browser/SSR environments.
