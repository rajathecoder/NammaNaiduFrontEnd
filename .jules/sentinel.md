# Sentinel's Journal

## 2025-02-18 - Weak Input Validation in Critical Flows
**Vulnerability:** Registration and Login forms accepted unvalidated input. Specifically, the mobile number validation only checked for non-empty string after stripping non-digits, allowing incorrect lengths (e.g., 12 digits for +91) or double country codes. Inputs were also stored in localStorage without sanitization, risking XSS if rendered unsafe later.
**Learning:** The codebase relied on implicit "happy path" assumptions for user input. Explicit validation libraries or utilities were missing.
**Prevention:** Created a centralized `validation.ts` utility with strict regex patterns for Name, Mobile (context-aware), and Email, plus a sanitizer to strip HTML tags. Enforced this validation before API calls and localStorage updates.
