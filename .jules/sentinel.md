
## 2025-02-19 - Fix XSS Vulnerability in CMS Pages using DOMPurify
**Vulnerability:** CMS page content rendered via dangerouslySetInnerHTML without HTML sanitization across multiple CMS-related pages.
**Learning:** Rendering dynamic CMS content provided by backend APIs directly into the DOM using dangerouslySetInnerHTML can lead to Cross-Site Scripting (XSS) if the data source is compromised.
**Prevention:** Always sanitize dynamic HTML content using an established library like DOMPurify prior to passing it to dangerouslySetInnerHTML.
