## 2023-10-24 - DOMParser Sanitization Null Byte Bypass
**Vulnerability:** XSS possible when null bytes are used in attributes with javascript: URIs
**Learning:** DOMParser converts null bytes to the unicode replacement character, which can bypass basic string prefix matching on javascript:
**Prevention:** explicitly replace null bytes and the unicode replacement character before checking.
