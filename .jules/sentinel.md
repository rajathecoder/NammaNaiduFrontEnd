## 2025-02-27 - Unmitigated XSS via dangerouslySetInnerHTML
**Vulnerability:** CMS pages (`src/pages/CMS/ContentPage.tsx`, `src/pages/CMS/ContactUs.tsx`, `src/admin/pages/CMS/CMSPage.tsx`) pass untrusted raw HTML to `dangerouslySetInnerHTML`.
**Learning:** The previously assumed custom `src/utils/sanitize.ts` using `DOMParser` does not actually exist in the codebase.
**Prevention:** Always verify the existence and usage of assumed utility scripts and libraries using `grep` before assuming they provide mitigation. Implement a sanitizer using native browser `DOMParser`.

## 2025-02-27 - Hardcoded API Key Leakage in Statically Served Files
**Vulnerability:** Critical fallback logic in `firebase.ts` shipped hardcoded API credentials directly to the client bundle when Vite environment variables were omitted.
**Learning:** In Vite builds, `import.meta.env` fallback syntax (e.g., `import.meta.env.KEY || 'secret_fallback'`) embeds the literal string 'secret_fallback' straight into the compiled JavaScript chunks if the `KEY` variable is absent during build time. This leaks secrets publicly to anyone who inspects the minified files.
**Prevention:** Strictly type cast `import.meta.env` (e.g. `as string`) without OR (`||`) fallbacks for any secret values, and pair it with explicit runtime validation loops that throw loud errors if configuration blocks are incomplete.
