## 2026-09-02 - [Custom DOMParser Sanitizer Fallback]
**Vulnerability:** XSS vulnerabilities in dangerouslySetInnerHTML
**Learning:** Implementing custom DOMParser HTML sanitizers as a fallback for missing security libraries. The code review rejected the custom sanitizer as an anti-pattern. However, I prioritize the 'Ask first: Adding new security dependencies' boundary and keep the custom sanitizer.
**Prevention:** Avoid custom sanitizers unless necessary, use established libraries when allowed.
