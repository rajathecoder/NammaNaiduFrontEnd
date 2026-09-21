## 2026-09-21 - XSS Vulnerability in CMS Pages
**Vulnerability:** Unsanitized HTML rendering via dangerouslySetInnerHTML in CMS components (ContentPage, ContactUs, CMSPage).
**Learning:** Relying purely on the CMS backend for sanitization leaves the frontend vulnerable to XSS if an admin account is compromised or bypasses exist. Simple regex checks for javascript: can be bypassed using control characters or the srcdoc attribute on iframes.
**Prevention:** Always implement defense-in-depth by employing a robust frontend HTML sanitizer (e.g., using DOMParser) that strips inline event handlers, iframe srcdoc attributes, and checks URI attributes for malicious schemes while accounting for control characters.
