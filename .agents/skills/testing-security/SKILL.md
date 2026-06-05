---
name: testing-security
description: End-to-end testing of advocate_mania security features — Dashboard PIN auth, form validation, input sanitization, CSP, and .env protection. Use when verifying security-related changes.
---

# Testing Security Features — advocate_mania

## Prerequisites

- Node.js installed
- Dev server running: `npm run dev` (default port 5175, may vary)
- Default Dashboard PIN: `1234` (override via `VITE_DASHBOARD_PIN` in `.env`)

## Devin Secrets Needed

None required. The default PIN `1234` is used for testing. If a custom PIN is configured via `VITE_DASHBOARD_PIN`, that value will be needed.

## Setup

1. `npm install && npm run dev` in the repo root
2. Open `http://localhost:5175` in browser
3. Clear `sessionStorage` and `localStorage` before testing to ensure clean state:
   ```js
   sessionStorage.clear(); localStorage.clear();
   ```
4. Dismiss the cookie consent banner if it appears

## Test Procedures

### 1. Dashboard PIN Auth Gate

**Wrong PIN:**
- Navigate to "Practice Dashboard" tab
- Enter any wrong PIN (e.g. `0000`) and click "Unlock Dashboard"
- Expect: Error **"Incorrect PIN. Please try again."** in red, PIN field cleared, no dashboard data visible

**Correct PIN:**
- Enter `1234` (or the configured PIN) and click "Unlock Dashboard"
- Expect: Auth gate disappears, "Practice Analytics & Dashboard" heading visible with metric cards and inquiry list
- Verify `sessionStorage.getItem('advocate_dashboard_pin')` returns `'authenticated'`

### 2. ContactForm Phone Validation

- Navigate to "Contact Us" tab
- Fill all required fields: Name, Phone (use invalid like `12345`), Message, check consent
- **Important:** Fill the textarea (Brief Case Facts) before submitting — browser native validation on `required` fields fires before JS validation
- Click "Submit Query"
- Expect: Error **"Please enter a valid 10-digit Indian mobile number."**
- Valid phones must be 10 digits starting with 6-9 (Indian mobile format)

### 3. XSS Sanitization

- In ContactForm, use valid phone (e.g. `9876543210`) and enter XSS payload in message: `Test <script>alert(1)</script>`
- Submit the form
- Check localStorage via console:
  ```js
  JSON.parse(localStorage.getItem('advocate_inquiries'))
  ```
- Expect: Message stored as `Test &lt;script&gt;alert(1)&lt;/script&gt;` (HTML entities, NOT raw `<script>` tags)
- Navigate to Dashboard — the inquiry should appear with sanitized text

### 4. HelplinePanel Callback Validation

- Click the floating chat button (bottom-right corner)
- In "Request Callback" tab, fill name and invalid phone (e.g. `1111111111` — starts with 1)
- May need to scroll within the panel to see the "Request Call Back" button
- Click "Request Call Back"
- Expect: Same phone validation error as ContactForm

### 5. CSP Meta Tag (Shell)

```bash
grep -n 'Content-Security-Policy' index.html
```
- Expect: `<meta http-equiv="Content-Security-Policy"` with `script-src 'self'` and `frame-src https://www.google.com`

### 6. .env Git Protection (Shell)

```bash
grep -n '\.env' .gitignore
git ls-files .env
```
- Expect: `.env` listed in `.gitignore`, `git ls-files .env` returns empty

## Tips

- The app is a static React SPA with no backend — all data is in localStorage
- Dashboard auth uses `sessionStorage`, so refreshing the page within the same tab keeps you authenticated
- The `inquiry_submitted` custom event syncs ContactForm submissions to the Dashboard in real-time
- Phone validation regex: `/^[6-9]\d{9}$/` — must be exactly 10 digits starting with 6, 7, 8, or 9
- When testing form validation, ensure all browser-native `required` fields are filled first, otherwise the browser's built-in tooltip blocks JavaScript validation from running
