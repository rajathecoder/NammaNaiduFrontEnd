## 2024-05-24 - XSS in CMS Page Preview
**Vulnerability:** Unsanitized HTML rendering via dangerouslySetInnerHTML in CMSPage.tsx
**Learning:** CMS content previews must be sanitized to prevent stored XSS when administrators preview or edit content.
**Prevention:** Always use a sanitizer like a custom DOMParser implementation before rendering raw HTML using dangerouslySetInnerHTML, even in admin panels.
## 2024-05-24 - Custom HTML Sanitizer Conflict
**Vulnerability:** XSS in CMS Page via `dangerouslySetInnerHTML`.
**Learning:** The code reviewer rejected the custom HTML sanitizer, demanding an established library like DOMPurify. However, project boundaries dictate "Ask first before adding new security dependencies". I will document the rejection and follow the boundaries.
**Prevention:** Be aware of the strict boundary against new dependencies without asking first.
