# Grievance System

  A user-friendly grievance portal for organizations.

  This app allows residents, family members, and staff to file grievances, keep a reference code, and let administrators review and update submissions in a protected dashboard.

  ## What you get

  - A clear, step-by-step grievance submission flow.
  - Email and name validation to reduce invalid form entries.
  - Browser draft saving, so users do not lose progress.
  - Device-specific past grievance history on the homepage.
  - Search by grievance reference ID directly from the homepage.
  - Admin login and dashboard access for managing grievances.
  - Support for Firebase Firestore storage with a local fallback when not configured.

  ## How it works

  1. A user opens the homepage and chooses to submit a grievance.
  2. The grievance form collects personal details and issue details in two steps.
  3. After submission, the flow returns a reference code.
  4. The user can return to the homepage to view past device submissions.
  5. The user can also look up any submission by reference code.
  6. Admins log in to review grievance reports, filter them, and update status.

  ### Submission flow

  ```text
  Homepage --> Submit grievance --> Fill form step 1 --> Fill form step 2 --> Review & submit --> Success + reference code
  ```

  ### Admin flow

  ```text
  Admin login --> Dashboard --> Filter / search grievances --> View details --> Update status
  ```

  ## Setup

  ### Requirements

  - Node.js 18 or higher
  - npm

  ### Install and run

  ```bash
  cd grievance-system
  npm install
  npm run dev
  ```

  Open `http://localhost:3000` in the browser.

  ## Environment variables

  The app works in two modes:

  - **Firebase mode** when Firestore environment variables are set.
  - **Local fallback mode** when Firebase is not configured.

  ### Firebase settings

  Add these values to `.env.local` to enable Firestore writes:

  ```env
  FIREBASE_PROJECT_ID=your-firebase-project-id
  FIREBASE_CLIENT_EMAIL=your-service-account-email
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
  ```

  If you also use Firebase web SDK features, include:

  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=...
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  NEXT_PUBLIC_FIREBASE_APP_ID=...
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
  ```

  ### Admin credentials

  The app supports either one local admin account or multiple local admin accounts.

  #### Single fallback account

  ```env
  ADMIN_USERNAME=admin
  ADMIN_PASSWORD=admin123
  ```

  #### Multiple local accounts

  ```env
  ADMIN_CREDENTIALS=admin:admin123,manager:pass123
  ```

  Or use JSON format:

  ```env
  ADMIN_CREDENTIALS=[{"username":"admin","password":"admin123"},{"username":"manager","password":"pass123"}]
  ```

  ### Firebase admin credentials

  If Firebase is configured, admin credentials can also come from the Firestore collection `admin_credentials`.
  Each document should include `username` and `password` fields.

  ## Main pages

  - `/` — homepage with quick access to submit a grievance, search by reference ID, and view device history.
  - `/submit` — two-step grievance submission form.
  - `/submit/report` — search for a grievance by its reference code.
  - `/admin/login` — admin login page.
  - `/admin/dashboard` — admin dashboard for reviewing and managing grievances.

  ## Project structure

  - `app/` — Next.js routes and page components.
  - `app/submit/` — grievance form flows and actions.
  - `app/admin/` — admin login and dashboard.
  - `lib/` — shared utilities, schema validation, database helpers, and auth helpers.

  ## Validation details

  - Names only accept letters, spaces, apostrophes, and hyphens.
  - Email fields must be valid email addresses.
  - The grievance description requires a minimum length.
  - The same Zod schema is used on the client and server.

  ## Deployment notes

  - `npm run build` verifies the app compiles correctly.
  - If Firebase credentials are missing, the app continues with local storage.
  - Admin login will still work with the fallback credentials.

  ## Build

  ```bash
  npm run build
  ```

  ## License

  This project is provided as-is for internal or demonstration use.
