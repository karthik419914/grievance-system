# Grievance System

A modern, user-friendly grievance portal built with **Next.js**, **React**, and **Material UI (MUI)**. It helps organizations capture concerns, manage submissions, and manage administrators through secure database roles.

The application operates in **Firebase mode** when credentials are provided in the environment settings, and falls back to a **local JSON database** when Firestore is not configured.

---

## Key Features

### 1. User Grievance Portal
* **Visual Homepage Layout**: Clean hero section, side-by-side quick cards, and centered blocks.
* **Flowchart "How It Works"**: Redesigned step-by-step workflow guide.
* **Draft Auto-Saving**: Users can manually save their draft at any stage (Step 1, Step 2, or Review), displaying a success popup. Drafts are reloaded automatically on return.
* **Past Submissions History**: View previous submissions from the same browser. Clicking any submission opens a details popup modal.
* **Lookup by ID**: Search and retrieve the status of any grievance by its reference code.
* **Clickable Support Email**: Active hyperlink in the Contact Us section for direct email communication.

### 2. Admin Dashboard & Management
* **Authentication**: Login page validating credentials against Firestore.
* **Full-Page Grievance Reports**: Clicking a grievance opens a full-fledged report details page (`/admin/dashboard/[id]`) with a back button and status update selector.
* **Main Admin Permission Check**: The default credentials are set to  (Main Admin).
* **Role-Based Admin Management**: 
  * Only the Main Admin  is allowed to see the "Manage Admins" button.
  * Clicking "Manage Admins" opens a modal to **list all current admin accounts**, **delete admin accounts** (with self-deletion protection), and **create new administrators** (requiring passwords to be entered twice and matching validation).
  * Regular administrators have access only to review grievances and update their status.

---


### 1. User Grievance Workflow

```mermaid
graph TD
    A[Start: Homepage] --> B[Submit a Grievance]
    B --> C{Form Step 1: Submitter Info}
    C -->|Save Draft| D[Local Storage Draft]
    C --> E{Form Step 2: Grievance Details}
    E -->|Save Draft| D
    E --> F[Form Step 3: Review Details]
    F -->|Submit| G[Submit Action]
    G -->|Success| H[Generate Reference Code]
    H --> I[Saved to Database & Browser History]
    A --> J[Search Grievance by ID]
    A --> K[Click Past Grievance Card] --> L[Open Detail Modal]
```

### 2. Admin Authentication & Role-Based Flow

```mermaid
graph TD
    A[Admin Login] --> B[Enter Email & Password]
    B --> C{Credentials Valid?}
    C -->|No| D[Show Login Error]
    C -->|Yes| E[Save Email in Session Cookie]
    E --> F[Redirect to Admin Dashboard]
    F --> G{Is Main Admin: karthik419914@gmail.com?}
    G -->|No| H[Standard Dashboard: View Grievances, Filter, View Details Page, Update Status]
    G -->|Yes| I[Standard Dashboard + Manage Admins Option]
    I --> J[Manage Admins Dialog]
    J --> K[List All Admins in Firestore]
    J --> L[Delete Admin Accounts except main admin]
    J --> M[Add New Admin type passwords twice]
```

---

## Directory Routing Map

- `/` — Homepage: Submit grievance, search by reference ID, view history, about, and contact details.
- `/submit` — Three-step wizard form to submit a grievance (with auto-draft saves).
- `/submit/report` — Lookup grievance details by reference code.
- `/admin/login` — Sign-in portal for administrators.
- `/admin/dashboard` — Standard dashboard layout showing all submissions.
- `/admin/dashboard/[id]` — Dedicated full-page view detailing a specific grievance report.

---

## Setup & Local Run

### Requirements
- **Node.js** 18 or higher
- **npm**

### Install and Run

1. Clone or navigate to the repository directory:
   ```bash
   cd grievance-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables Configuration

Create a `.env.local` file at the root of the project to set up variables:

### 1. Firebase Firestore Settings
To store grievances and admin credentials in Firestore, add your service account credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Client SDK configs (optional/fallback)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

