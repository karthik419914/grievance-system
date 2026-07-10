# Grievance System

A multi-step grievance submission system built for a nursing home setting:
residents and families can file a grievance in a short, guided form, and
staff review everything through a separate admin dashboard.

Built with **Next.js (App Router)**, **TypeScript**, **Zod**, **React Hook
Form**, and **Material UI**.

---

## What's included

- **Public submission flow** (`/submit`) — a 3-step wizard (Your Details →
  Grievance Details → Review & Submit), Zod-validated at every step, with
  the draft auto-saved to the browser so a resident can leave and come back.
- **Admin dashboard** (`/admin/dashboard`) — a separate, login-protected
  view where staff can see every grievance, filter by priority / status /
  category, search, sort by submission date, and update a grievance's
  status.
- **Server Actions** for the final submission and for status updates —
  validated again on the server with the same Zod schema used on the
  client.

---

## Getting started

**Requirements:** Node.js 18.18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) set admin credentials
cp .env.example .env.local

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Submit a grievance at `/submit`
- Sign in to the admin dashboard at `/admin/login`
  (configure admin credentials in `.env.local`)

---

## Folder structure

```
app/
  page.tsx                   Landing page (choose: submit vs admin)
  layout.tsx                 Root layout — MUI theme + font setup

  submit/
    page.tsx                 Submit page shell
    actions.ts                'use server' — validates & saves the final submission
    useDraft.ts               Client hook: save/restore draft via localStorage
    components/
      GrievanceForm.tsx       Wizard state machine (step index, draft, submit)
      StepOne.tsx              Step 1 — submitter details (Zod + RHF)
      StepTwo.tsx              Step 2 — grievance details (Zod + RHF)
      StepReview.tsx           Step 3 — review summary, edit-in-place links
      SuccessScreen.tsx        Post-submit confirmation with a reference ID

  admin/
    login/
      page.tsx                 Login form (useFormState / useFormStatus)
      actions.ts                'use server' — validates credentials, sets session cookie
    dashboard/
      layout.tsx                App bar + sign-out, wraps every dashboard page
      page.tsx                  Server component — fetches grievances
      actions.ts                 'use server' — update status, logout
      components/
        DashboardClient.tsx      Filter/sort state + layout
        StatCards.tsx             New / In Review / Urgent / Resolved counts
        FilterBar.tsx             Priority / status / category / search / sort
        GrievanceTable.tsx        The list, click a row to open details
        GrievanceDetailDialog.tsx Full detail view + status change
        LogoutButton.tsx          Signs out via a Server Action

middleware.ts                 Redirects unauthenticated requests away from
                               /admin/dashboard/*

lib/
  schema.ts                   Zod schemas (per-step + combined) — the single
                               source of truth for validation, on both the
                               client and inside Server Actions
  types.ts                    Grievance + status types
  db.ts                       Data access layer (see note below)
  auth.ts                     Cookie-based admin session helpers
  theme.ts                    MUI theme
  ui-utils.ts                 Chip colors, date formatting

data/grievances.json          Seed data (a few sample grievances)
```

---

## Key design decisions

**Why a JSON file instead of a real database?**
For an interview-scope assignment, the goal was something a reviewer can
clone and run in under a minute with zero external setup — no DB server,
no connection string, no seed script. `lib/db.ts` is a thin data-access
layer with three functions (`getAllGrievances`, `addGrievance`,
`updateGrievanceStatus`); swapping it for Prisma + Postgres, MongoDB, or
Supabase means rewriting that one file — nothing in the UI, the Server
Actions, or the validation layer would need to change.

**Why localStorage for drafts instead of a server-side draft?**
The submission form intentionally has no login for residents/families —
that's what keeps it short. A server-side draft would need some identity
to key it on. Since the form is only 2 data-entry steps, saving to
`localStorage` on every "Next" click is enough to survive an accidental
tab close or a resident needing to pause, without adding an account system
to a flow that's meant to stay lightweight.

**Why Server Actions in two places (not API routes)?**
`app/submit/actions.ts` handles the actual submission, and
`app/admin/dashboard/actions.ts` handles status changes and logout. Both
re-validate on the server (the client-side Zod validation is for instant
feedback, not the actual guard), and `revalidatePath` keeps the dashboard
in sync after a status change without a separate fetch call.

**Why one shared Zod schema (`lib/schema.ts`)?**
`stepOneSchema` and `stepTwoSchema` validate each step in the wizard as
the user moves through it (via `react-hook-form` + `@hookform/resolvers`);
`grievanceSchema` (the merge of both) is what the Server Action validates
against on final submit. One definition, no drift between client and
server rules.

**Admin auth is intentionally simple.** It's a single hardcoded
username/password pair (via env vars) and an httpOnly session cookie
checked in `middleware.ts`. That's enough to demonstrate a protected
admin surface for this assignment — a production version would swap this
for NextAuth.js (or similar) with per-staff accounts and password hashing.

---

## A note on the two deliverables I couldn't produce

I built and wrote out the full project, but I don't have the ability to
push to GitHub or deploy from here, so:

- **GitHub repo link** — not something I can create. The project is ready
  to push as-is (see below).
- **Live review URL** — same limitation; deploying to Vercel takes about
  two minutes once this is pushed to GitHub (import the repo at
  vercel.com/new, no config needed).

### Pushing this to GitHub

```bash
cd grievance-system
git init
git add .
git commit -m "Grievance portal: multi-step form + admin dashboard"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

---

## Possible next steps (not required for this assignment)

- Real database + an ORM (Prisma) instead of the JSON file
- Per-staff admin accounts with hashed passwords
- Email/SMS notification to staff when an `urgent` grievance is filed
- Pagination on the dashboard table once volume grows
- File/photo attachments on a grievance
