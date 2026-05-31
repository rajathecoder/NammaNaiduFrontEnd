## 2025-02-27 - [XSS via un-sanitized dangerouslySetInnerHTML]
**Vulnerability:** Unsanitized use of `dangerouslySetInnerHTML` in CMS components (`ContentPage.tsx`, `ContactUs.tsx`, `CMSPage.tsx`).
**Learning:** CMS data can easily act as a stored XSS vector if not sanitized, enabling arbitrary script execution for any user accessing the page.
**Prevention:** Always use a robust HTML sanitizer like `DOMPurify` before injecting HTML strings into the DOM via `dangerouslySetInnerHTML`.
