## 2024-05-24 - [Implement Custom HTML Sanitization]
**Vulnerability:** XSS vulnerability through dynamically rendering CMS content using dangerouslySetInnerHTML without sanitization.
**Learning:** Using basic string replacement or .startsWith('javascript:') is insufficient as it ignores embedded whitespace and HTML entities. data: URIs and srcdoc attribute in iframe must be handled explicitly.
**Prevention:** Always use a comprehensive DOMParser based custom sanitizeHtml utility or an external well tested library when rendering user input to prevent XSS. Explicitly sanitize inline events, malicious URIs, and dangerous attributes.
