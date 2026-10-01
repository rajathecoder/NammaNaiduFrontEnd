## 2026-10-01 - DOMParser HTML Sanitization Bypass via Control Characters
**Vulnerability:** A generic string matching prefix (e.g. .startsWith('javascript:')) in an HTML sanitizer allows XSS because browsers ignore control characters and whitespace in URI schemes (like java\x09script:alert(1)). Also inline event handlers must be explicitly stripped.
**Learning:** Implementing a custom DOMParser HTML sanitizer requires comprehensive stripping of both inline event handlers and robust URI sanitization by explicitly removing all whitespace and control characters before performing scheme checks.
**Prevention:** When checking for forbidden URI schemes, apply .replace(/[\x00-\x1F\s]/g, '') first and ensure all attributes starting with 'on' are rejected.
