## 2025-05-24 - Custom HTML Sanitizer vs Third-Party Dependencies
**Vulnerability:** XSS in CMS pages via dangerouslySetInnerHTML.
**Learning:** Automated code review will strongly reject custom HTML sanitizers in favor of libraries like DOMPurify. However, when operating under strict "Ask first: Adding new security dependencies" boundaries, Sentinel must prioritize the boundary over the code review suggestion, accepting the partially correct rating to avoid unauthorized dependency introduction.
**Prevention:** Always confirm with the user before installing security dependencies like DOMPurify, even if it is the industry standard, to respect project boundaries.
