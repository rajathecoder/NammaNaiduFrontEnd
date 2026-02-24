## Sentinel Journal

## 2026-02-24 - Committed Secrets in .env.production
**Vulnerability:** The `.env.production` file containing production Firebase API keys was committed to the repository.
**Learning:** The `.gitignore` file had specific rules for `.env` and `.env.local` but missed `.env.production`.
**Prevention:** Update `.gitignore` to explicitly ignore `.env.production`. Implement `getRequiredEnv` helper to fail securely if secrets are missing.
