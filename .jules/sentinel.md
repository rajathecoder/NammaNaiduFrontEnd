## 2024-05-18 - [DOMPurify Missing in dangerouslySetInnerHTML]
**Vulnerability:** XSS vulnerability via dangerouslySetInnerHTML without sanitization in CMS pages
**Learning:** `dangerouslySetInnerHTML` is used in multiple CMS components (`ContentPage.tsx`, `ContactUs.tsx`, `admin/pages/CMS/CMSPage.tsx`) directly accepting API responses without sanitization.
**Prevention:** Always use a sanitizer like DOMPurify when rendering raw HTML in React, especially for CMS content. Provide a `sanitize.ts` utility and wrap all `dangerouslySetInnerHTML` calls.
