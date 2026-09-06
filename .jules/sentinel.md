## 2025-05-15 - Custom DOMParser XSS Fallback
**Vulnerability:** XSS vulnerability in dangerouslySetInnerHTML rendering raw CMS HTML without an established sanitization library like DOMPurify.
**Learning:** Cannot install external dependencies like DOMPurify without asking first, so a custom fallback sanitizer using DOMParser is required to mitigate immediate risk while obeying boundaries.
**Prevention:** Always default to established libraries like DOMPurify for sanitizing HTML, but when blocked by strict boundaries, implement aggressive DOM traversal stripping <script>, on* events, and javascript: URIs (handling control chars and \ufffd).
