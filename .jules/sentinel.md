## 2026-09-16 - Custom HTML Sanitizer for CMS
**Vulnerability:** Unsanitized CMS content was directly rendered using `dangerouslySetInnerHTML` in `ContentPage.tsx`, `ContactUs.tsx`, and `CMSPage.tsx`, leading to a high-severity Stored XSS vulnerability.
**Learning:** When implementing a custom `DOMParser` HTML sanitizer in a React SSR environment, the sanitizer must fail closed if `window` is undefined. Furthermore, the sanitization regex must explicitly account for `\ufffd` because `DOMParser` automatically converts null bytes (`\x00`) to the unicode replacement character, which could otherwise be used for `javascript:` URI bypasses. The tag allowlist must also include semantic and rich media tags to preserve legitimate CMS content, as well as `html`, `head`, and `body` to support JSDOM testing.
**Prevention:** Always pass CMS HTML through a strict `DOMParser`-based allowlist sanitizer before using `dangerouslySetInnerHTML`, ensuring inline event handlers and URI-scheme bypasses are explicitly stripped.

## 2026-09-16 - Custom HTML Sanitizer vs Third-Party Dependency
**Vulnerability:** XSS in CMS.
**Learning:** The code reviewer suggested using a third-party dependency like DOMPurify or sanitize-html to avoid writing a custom HTML sanitizer, noting that custom sanitizers are often an anti-pattern. However, strict project boundaries forbid adding new security dependencies without asking first.
**Prevention:** Documented the conflict and rejected the suggestion to install the unauthorized package to adhere to strict boundary rules. Addressed the specific iframe srcdoc bypass found by the reviewer manually.
