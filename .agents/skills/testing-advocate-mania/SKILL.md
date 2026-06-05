---
name: testing-advocate-mania
description: End-to-end testing guide for the advocate_mania React app. Use when verifying UI changes, form submissions, or Dashboard functionality.
---

# Testing advocate_mania

## Prerequisites

- Node.js and npm installed
- Run `npm install` in the repo root
- Copy `.env.example` to `.env` if it doesn't exist

## Running Unit Tests

```bash
npm test          # runs vitest
npm run lint      # ESLint
npm run build     # production build check
```

## Running the Dev Server

```bash
npm run dev -- --host
```

The app will start on `localhost:5173` (or next available port if taken). Check the terminal output for the actual port.

## Key Test Flows

### 1. HelplinePanel Callback Form

The HelplinePanel is a floating button (bottom-right corner) that opens a slide-out panel.

1. Click the chat bubble icon (bottom-right) to open the panel
2. "Request Callback" tab is shown by default with name/phone/practice area fields
3. Fill in a valid name and 10-digit Indian mobile number (starts with 6-9)
4. Click "Request Call Back"
5. **Expected**: Green checkmark icon and "Callback Registered!" confirmation
6. The submitted inquiry is saved to `localStorage` under `advocate_inquiries`

**Validation checks**:
- Empty name → "Please fill in your name and phone number."
- Invalid phone (e.g. "12345") → "Please enter a valid 10-digit Indian mobile number."

### 2. Dashboard PIN Authentication

The Dashboard tab requires a PIN to access.

1. Click "Practice Dashboard" in the nav bar
2. A lock screen appears with "Dashboard Access" heading and PIN input
3. Wrong PIN → "Incorrect PIN. Please try again."
4. Correct PIN → Dashboard unlocks showing metric cards and inquiry data

**PIN configuration**:
- The PIN is set via `VITE_DASHBOARD_PIN` in `.env`
- Default from `.env.example`: `change-this-pin`
- Code fallback (DEFAULT_PIN): `1234`
- **For unit tests**: vitest config clears `VITE_DASHBOARD_PIN` so tests use DEFAULT_PIN `1234`
- **For browser testing**: `.env` value is used (typically `change-this-pin`)

### 3. Contact Form

1. Click "Contact Us" in the nav bar
2. Fill: Full Name, Mobile Number (10-digit), check consent checkbox
3. Submit → Success message with "Thank you"
4. Inquiry saved to `localStorage`

### 4. Case Flow Navigation

1. Click "Case Flow" in the nav bar
2. Step 1 (Filing & Registration) is active by default
3. Click "Next" to advance through 5 litigation stages
4. "Auto Play Flow" button cycles through stages automatically

## Environment Notes

- This is a pure frontend React app (Vite + React 19) with no backend
- All data is stored in `localStorage` — no API calls
- Cookie consent banner appears on first visit; dismiss it before testing
- The app uses lucide-react for icons — missing imports will cause runtime crashes (not build errors)
- No CI is currently configured on this repo

## Devin Secrets Needed

None — this is a local-only frontend app with no external services.
