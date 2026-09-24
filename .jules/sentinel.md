## 2024-05-24 - [CRITICAL/HIGH] Fix XSS vulnerability in CMS content rendering
**Vulnerability:** Unsanitized use of dangerouslySetInnerHTML in CMS components.
**Learning:** CMS components rely on `dangerouslySetInnerHTML` to render HTML pages but they don't sanitize the inputs. A malicious admin could execute XSS.
**Prevention:** Always use a custom HTML sanitizer (or dompurify) before calling `dangerouslySetInnerHTML`.

## 2024-05-24 - [Conflict] Automated reviewer vs Dependency boundaries
**Vulnerability:** Code reviewer rejected the custom HTML sanitizer implementation due to preference for DOMPurify and flagged potential SSR/SVG bypass issues.
**Learning:** The project has strict boundaries against adding unauthorized dependencies ('Ask first'). As a result, the code reviewer's suggestion to install `dompurify` must be rejected in favor of the custom implementation, and the SSR 'fail closed' guard must remain as specified in project memory.
**Prevention:** Future sanitization efforts must continue to rely on the custom DOMParser implementation unless explicit permission is granted to add dependencies.
