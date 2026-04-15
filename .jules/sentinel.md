## 2024-05-28 - Secure Local Storage of PII/Flow State
**Vulnerability:** Registration data, PII, and flow states like `otpFlow` were stored in `localStorage` rather than `sessionStorage`, making sensitive information persist indefinitely and increasing the risk of XSS persistence.
**Learning:** In a multi-step signup process, temporary registration data shouldn't be kept after the browser tab is closed.
**Prevention:** Always use `sessionStorage` for intermediate state handling that should only persist for the duration of the tab's session.
