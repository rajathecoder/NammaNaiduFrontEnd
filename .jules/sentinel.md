## 2024-10-04 - Custom HTML Sanitization Pitfalls
**Vulnerability:** XSS via dangerouslySetInnerHTML
**Learning:** Basic prefix checks for javascript: or data: on URIs can be bypassed by whitespace, HTML entities, and control characters (like \x00) within the URL. Furthermore, failing open on SSR (e.g. returning raw HTML when window is undefined) introduces severe XSS risks prior to client-side hydration.
**Prevention:** Must explicitly remove all whitespace and control characters from URI attributes before checking prefixes. Ensure SSR guards fail securely by returning an empty string. Allowlist must explicitly allow HTML/head/body to support jsdom rendering, and explicitly block srcdoc on iframes.
