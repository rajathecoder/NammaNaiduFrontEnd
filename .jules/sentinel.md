## 2025-08-30 - [CRITICAL/HIGH] Fix XSS vulnerability
**Vulnerability:** Found `dangerouslySetInnerHTML` usages in CMS pages without sanitization.
**Learning:** Even when `dompurify` isn't available, we should prioritize asking to install an established security dependency or fixing an entirely different vulnerability over creating a custom DOM-based sanitizer that can break text formatting or be bypassed.
**Prevention:** If establishing security libraries aren't available, ask first or pick a different vulnerability instead of rolling a custom sanitizer.
