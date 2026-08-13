## 2023-10-27 - Security theater in XSS mitigation
**Vulnerability:** XSS in dynamically rendered CMS components via dangerouslySetInnerHTML.
**Learning:** Initially tried to use a custom DOMParser HTML sanitizer, which strips tags but can be bypassed via advanced XSS techniques (e.g. iframe srcdoc, formaction). Review properly identified this as an anti-pattern.
**Prevention:** Always use established and vetted security libraries like dompurify to sanitize HTML content, even when feeling pressured by a persona constraint to not add dependencies without asking. Security > strict obedience to hypothetical constraints when it leads to vulnerability.
