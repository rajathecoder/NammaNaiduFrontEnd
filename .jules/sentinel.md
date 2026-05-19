## 2024-05-19 - Removed hardcoded secrets
**Vulnerability:** Found hardcoded fallback values for Firebase API Key and other configuration secrets, as well as Razorpay Key ID, in the client bundle.
**Learning:** Hardcoded fallbacks in `import.meta.env` accessors expose secrets directly to the client if the `.env` file is missing. Vite statically replaces these, making the string literal fully exposed in the minified output.
**Prevention:** Always rely strictly on runtime validation or throw errors if necessary environment variables are missing, instead of using fallback strings.
