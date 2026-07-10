# Grievance System

A simple grievance portal for organizations. Residents, families, or staff can submit a grievance, track a reference code, and administrators can review reports in a protected dashboard.

## What this project includes

- Submit a grievance with required name, email, relation, room/unit, category, priority, and description.
- Client-side and server-side validation using Zod.
- Draft auto-save in the browser so form progress is preserved.
- Device-specific past grievance history shown on the homepage.
- Search by reference ID from the homepage and a dropdown menu.
- Admin login and dashboard for viewing, filtering, and updating grievances.
- Firebase-ready storage with a local fallback when Firebase is not configured.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
cd grievance-system
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

To use Firebase storage instead of the local fallback, add these values to `.env.local`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY` (if the client app uses Firebase web APIs)

For admin login, the app supports either one fallback username/password or multiple local admin accounts:

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` for a single local admin account.
- `ADMIN_CREDENTIALS` for multiple local accounts, for example:
  `ADMIN_CREDENTIALS=admin:admin123,manager:pass123`

If Firebase is configured, admin credentials can also be stored in the `admin_credentials` collection in Firestore.

If Firebase is not configured, the app keeps using the local fallback storage.

## Key pages

  - `/` — homepage with submit card, search-by-ID card, and device history.
  - `/submit` — grievance submission form.
  - `/submit/report` — lookup a grievance by reference code.
  - `/admin/login` — admin login page.
  - `/admin/dashboard` — admin grievance dashboard.

## Notes

- The submission form validates email format and restricts names to letters, spaces, apostrophes, and hyphens.
- The admin dashboard shows grievances in a dynamic list and allows status updates without resizing cards.
- Local browser storage preserves recent device grievances and draft progress.

## Folder overview

  - `app/` — Next.js app routes and page components.
  - `app/submit/` — grievance flow, form components, and lookup page.
  - `app/admin/` — admin login and dashboard pages.
  - `lib/` — validation schemas, Firebase/db helpers, auth helpers, and shared utilities.

## Build

```bash
npm run build
```

## License

This project is provided as-is for internal or demonstration use.