## 2024-05-28 - XSS Vulnerability in CMS HTML Injection
**Vulnerability:** Unsanitized HTML content injected via dangerouslySetInnerHTML in CMS pages.
**Learning:** Custom DOMParser sanitizers must explicitly account for and remove � alongside standard control characters to prevent javascript: URI bypasses utilizing null bytes.
**Prevention:** Consistently apply HTML sanitization and ensure control/replacement characters are stripped before URI scheme validation.
