## 2023-10-12 - Missing HTML Sanitization in CMS pages
**Vulnerability:** XSS vulnerability through improperly sanitized user-supplied HTML using dangerouslySetInnerHTML.
**Learning:** Implementing a custom DOMParser HTML sanitizer requires strict checks for event handler attributes (like 'onerror') and 'javascript:' or 'data:' URIs (especially stripping whitespaces/control chars). React's dangerouslySetInnerHTML provides no built-in protection.
**Prevention:** Use a proper, custom DOMParser-based HTML sanitize function, explicitly validating tags, attributes, and scrubbing JavaScript from URLs when using dangerouslySetInnerHTML.
