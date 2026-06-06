## 2024-06-06 - Prevent XSS in CMS using DOMPurify
**Vulnerability:** XSS (Cross-Site Scripting) via unsanitized dangerouslySetInnerHTML in CMS pages.
**Learning:** Naively passing CMS or user-editable content directly into React's dangerouslySetInnerHTML opens the application to severe XSS attacks. Attackers can inject malicious scripts via attributes or tags if the HTML is not securely sanitized before rendering.
**Prevention:** Always use a robust, browser-compatible HTML sanitization library like DOMPurify when rendering untrusted or rich-text HTML content. Avoid custom regex sanitizers. Apply `DOMPurify.sanitize(content)` to any payload entering dangerouslySetInnerHTML.
