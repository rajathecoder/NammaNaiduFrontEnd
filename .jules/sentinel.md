## 2024-05-18 - Remove Hardcoded Firebase API Key
**Vulnerability:** A hardcoded Firebase API key was discovered in the frontend fallback bundle.
**Learning:** Hardcoded secrets present a critical risk.
**Prevention:** Remove fallback API keys directly in source code and use environment variables.
