## 2025-02-25 - React dangerouslySetInnerHTML XSS Vulnerability
**Vulnerability:** Found multiple instances where unsanitized HTML from the CMS API was rendered directly using React's `dangerouslySetInnerHTML={{ __html: content }}`.
**Learning:** This is a classic Cross-Site Scripting (XSS) vulnerability. If an attacker could compromise the CMS or if a privileged user entered malicious scripts, it would execute in every visitor's browser.
**Prevention:** Always use a sanitization library like `DOMPurify` before rendering raw HTML strings in React, even if the source is considered "trusted" (like an internal CMS). Created a `sanitizeHTML` utility to enforce this pattern defensively.
