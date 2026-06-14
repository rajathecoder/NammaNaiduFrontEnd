## 2024-05-24 - Cross-Site Scripting (XSS) in CMS Pages
**Vulnerability:** CMS page content containing arbitrary HTML was rendered unsanitized directly into the DOM using `dangerouslySetInnerHTML` in `ContentPage.tsx`, `ContactUs.tsx`, and the admin `CMSPage.tsx` live preview.
**Learning:** `dangerouslySetInnerHTML` allows unescaped script execution if the source data (e.g., from an API or admin CMS tool) contains malicious tags (like `<script>` or event handlers like `onerror`). Even internal or CMS-driven content should never be fully trusted.
**Prevention:** Always wrap dynamically fetched HTML content with a sanitizer library like `DOMPurify` before injecting it via `dangerouslySetInnerHTML`.
