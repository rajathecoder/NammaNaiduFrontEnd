## 2024-05-18 - Storage of PII Registration Data in localStorage
**Vulnerability:** Sensitive Personal Identifiable Information (PII) like name, gender, and mobile numbers along with authorization state (`otpFlow`) were being persisted across sessions via `localStorage` during the user registration process.
**Learning:** This exposes user data and internal flows to cross-site scripting (XSS) attacks indefinitely since `localStorage` does not clear on its own, providing an ongoing persistence vector for sensitive data.
**Prevention:** Always use `sessionStorage` for intermediate state or multi-step processes like sign-up or checkout, ensuring data is cleared completely when the tab or session is closed.
