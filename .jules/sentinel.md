## 2026-09-08 - DOMParser Sanitization Bypasses
**Vulnerability:** XSS vulnerability via dangerouslySetInnerHTML without proper sanitization.
**Learning:** Custom DOMParser sanitizers require strict handling of null bytes (\x00) and replacement characters (\ufffd), as DOMParser automatically converts null bytes to \ufffd. Leading whitespace in attributes can also bypass javascript: URI checks.
**Prevention:** Apply .trim() to attribute values before checking forbidden URI schemes, explicitly remove both null bytes and \ufffd, and ideally use a well-tested library like DOMPurify when constraints allow.
