## 2026-09-15 - Custom HTML Sanitizer
**Vulnerability:** XSS vulnerabilities via unescaped dangerouslySetInnerHTML and null byte/whitespace bypasses.
**Learning:** JSDOM wraps parsed HTML in html/head/body tags which must be allowed. Null bytes get converted to \ufffd. Also, SSR guards in security functions MUST fail closed (e.g. return empty string), not open, to prevent bypasses during server-side execution. Allowed tags must include rich media (iframes, video) for CMS usage.
**Prevention:** Trim attributes and strip control characters including \ufffd in addition to typical XSS defenses.
