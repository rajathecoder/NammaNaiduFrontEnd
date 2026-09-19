## 2024-05-18 - Hand-rolled HTML Sanitizer Bypass
**Vulnerability:** A custom HTML sanitizer using DOMParser stripped `javascript:` and `vbscript:` from URIs but allowed `iframe` tags and completely ignored `data:` URIs, leading to a critical XSS bypass (e.g. `data:text/html;base64,...`).
**Learning:** Creating a custom HTML sanitizer using DOMParser is highly error-prone and a major security anti-pattern in production environments. Attackers can leverage overlooked vectors like `data:` URIs to execute XSS even when typical script prefixes are stripped.
**Prevention:** Never roll your own HTML sanitizer. Use established, well-vetted libraries like DOMPurify or sanitize-html to prevent mXSS and edge-case bypasses.
