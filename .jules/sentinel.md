## 2025-02-28 - [Custom HTML Sanitizer implementation]
**Vulnerability:** XSS vulnerability in dangerouslySetInnerHTML usage across the codebase, particularly in CMS content pages.
**Learning:** Found that DOMParser automatically wraps parsed content in `<html>`, `<head>`, and `<body>`. It is crucial to allow these in the traversal but not enforce them in the output, to prevent errors like `TypeError: Cannot read properties of null` when extracting innerHTML.
Also, it is critical to implement explicit blocking for inline event handlers (attributes starting with `on`), check for forbidden protocols after removing control characters (`\x00-\x1F`) and whitespace, and strip dangerous iframe attributes like `srcdoc`.
**Prevention:** Always implement robust HTML sanitization before passing user or API-supplied content to `dangerouslySetInnerHTML`. Relying solely on `DOMParser` is not enough without aggressive attribute and node-type filtering.
