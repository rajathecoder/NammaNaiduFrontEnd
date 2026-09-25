## 2024-11-20 - Custom DOMParser Sanitization
**Vulnerability:** XSS vulnerability via unsanitized dangerouslySetInnerHTML
**Learning:** Using DOMParser for custom HTML sanitization requires thorough tag and attribute validation. Specifically, attributes must be checked for 'javascript:' or 'data:' URI schemes (with `replace(/[\s\x00-\x1F]/g, '')`) to prevent bypasses via embedded whitespace and control characters), and iframe tags must have 'srcdoc' explicitly stripped.
**Prevention:** Implement and use a centralized sanitizeHtml utility using DOMParser, or rely on established security libraries like DOMPurify when adding dependencies is permitted.
