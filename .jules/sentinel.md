## 2024-05-18 - [Fix CMS XSS via Custom HTML Sanitizer]
**Vulnerability:** XSS vulnerability in CMS components using dangerouslySetInnerHTML without sanitization.
**Learning:** In a codebase avoiding unauthorized dependencies, we must manually build a DOMParser based sanitizer. Crucially, basic attribute checks are easily bypassed, so we must remove all whitespace and control characters (e.g. \x00-\x1F) before checking for javascript: / data: / vbscript: payloads.
**Prevention:** Always sanitize dynamically rendered HTML, and explicitly handle inline event handlers, `srcdoc` in iframes, and obscured URI schemes.
