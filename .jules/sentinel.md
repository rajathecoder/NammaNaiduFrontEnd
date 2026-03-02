## 2024-03-24 - [DOMPurify XSS Prevention]
**Vulnerability:** Found multiple usages of `dangerouslySetInnerHTML` directly rendering CMS-provided content without any prior sanitization. This could lead to a Cross-Site Scripting (XSS) vulnerability if malicious content is introduced into the CMS via an admin account or other injection vectors.
**Learning:** `dangerouslySetInnerHTML` should never be used without an intermediary sanitization step when handling user or external content. Wrapping it in a robust utility component is crucial for centralized security.
**Prevention:** Created a `SanitizedHTML` component using `DOMPurify` to ensure all HTML is safely sanitized before being rendered into the DOM. Replaced raw `dangerouslySetInnerHTML` instances with this component.
