
## 2025-02-20 - Custom HTML Sanitizer Bypassed
**Vulnerability:** XSS bypass in custom HTML sanitizer
**Learning:** Writing a custom HTML sanitizer is heavily discouraged. The provided implementation was vulnerable to bypasses because browsers ignore whitespace/control characters within URL protocols (e.g. `java&#x09;script:alert(1)`), which bypasses basic prefix checks. However, I am not allowed to install new dependencies like DOMPurify without asking first.
**Prevention:** Use battle-tested libraries like `dompurify` instead of custom regex/traversal logic for HTML sanitization when authorized.
