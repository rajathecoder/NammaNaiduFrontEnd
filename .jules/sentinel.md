## 2024-05-18 - HTML Sanitizer Bypass via Embedded Control Characters
**Vulnerability:** XSS bypass possible against simple `startsWith` checks on URI attributes because browsers ignore whitespace and control characters in HTML entities.
**Learning:** Implementing `DOMParser` sanitization requires explicitly removing whitespace and control chars `/[\\x00-\\x1F\\s]/g` before protocol matching, and also handling `iframe srcdoc` and inline `on*` event handlers to be fully robust.
**Prevention:** When building custom HTML sanitizers instead of using established libraries (like DOMPurify), you must apply strict regex cleaning on URIs before protocol matching to avoid obfuscated payload execution.
## 2024-05-18 - Custom Sanitizer Security Risks
**Vulnerability:** A previously proposed custom `DOMParser`-based HTML sanitizer for CMS content failed open on SSR, creating a severe XSS risk before hydration.
**Learning:** When writing custom HTML sanitization, failing open on SSR exposes the application to immediate XSS because the server will deliver the malicious payload to the client. Security controls must fail securely.
**Prevention:** When an established library like DOMPurify cannot be used due to constraints, ensure the custom sanitizer fails securely (e.g., `if (typeof window === "undefined") return "";`) on invalid states or environments.
