## 2025-02-14 - Prevent XSS in dynamically injected CMS content
**Vulnerability:** CMS page content rendered via `dangerouslySetInnerHTML` directly passed unsanitized server data to the DOM.
**Learning:** Even internal CMS systems can become vectors for Stored XSS if accounts are compromised or if data originates from an untrusted source. Relying on SSR fallbacks via regex for XSS prevention is insecure and error-prone compared to browser-tested sanitizers like DOMPurify.
**Prevention:** Always wrap `dangerouslySetInnerHTML` data with `dompurify` based sanitizers, even for trusted sources. Do not use custom regex sanitizers.
