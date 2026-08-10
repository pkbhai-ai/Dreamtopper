# Topper Dream — JEE Study Material Hub

A premium, mobile-first study-material site where admins upload daily PDFs and students browse, search, view, and download them.

## Design direction

- Deep navy base, crisp white surfaces, gold + cyan accents
- Strong display typography, rounded cards, soft shadows, subtle gradients
- Sticky header with clean nav, mobile drawer menu, elegant footer
- Subtle hover/entry animations, generous spacing, no clutter

## Pages

1. **Home** — hero "Topper Dream" + subtitle, CTAs "View Today's PDFs" / "Browse Subjects", featured Physics / Chemistry / Mathematics cards, Latest Uploads, stats strip (Total PDFs, New Today, Subjects Covered, Active Students)
2. **Daily PDFs** — "Today's Uploads" block, then all PDFs reverse-chronological; search by title + filters for subject, chapter, date, material type
3. **Subjects** — subject cards leading into filtered PDF lists per subject and chapter
4. **Announcements** — simple list of admin notices
5. **About** — purpose of Topper Dream for JEE aspirants, credits "Developed by Ghanshyam Roy"
6. **Contact** — contact details + message form
7. **Admin Login** — email/password sign-in
8. **Admin Dashboard** — protected upload + manage area

## PDF card

Title, subject, chapter, date, material type badge (Notes, DPP, PYQ, Worksheet, Revision Sheet, Formula Sheet, Mock Test), View and Download buttons.

## Admin

- Sign in with email + password; multiple admins supported via a roles table — a user only reaches the dashboard after being granted the admin role
- Dashboard: upload PDF file, title, subject, chapter, material type, description, date, publish/unpublish toggle
- Manage list: edit, unpublish, delete existing materials
- Published items appear instantly in the public lists; unpublished stay hidden from students
- Announcements can also be posted from the dashboard

## Backend (Lovable Cloud)

Enable Lovable Cloud for database, auth, and file storage.

Tables:
- `materials` — title, subject, chapter, material_type, description, date, file_path, published, created_at
- `announcements` — title, body, created_at
- `profiles` — basic user info
- `user_roles` + `has_role()` security-definer function — admin role stored separately from profiles for safety

Storage: a `materials` bucket for PDFs; public read of published files, admin-only writes.

Security: row-level security everywhere. Students (including signed-out visitors) can read only published materials and announcements; inserts, updates, and deletes are restricted to admins. Uploads validated for file type and size.

## Technical notes

- TanStack Start routes: `/`, `/daily`, `/subjects`, `/announcements`, `/about`, `/contact`, `/auth`, `/_authenticated/admin`
- Design tokens (navy/gold/cyan, radii, shadows, gradients) defined in `src/styles.css`; no hardcoded colors in components
- Shared components: `Header`, `Footer`, `PdfCard`, `FilterBar`, `StatsStrip`, `SubjectCard`
- Reads go through server functions with TanStack Query; admin writes through authenticated server functions that verify the admin role
- Per-route SEO metadata (title, description, og/twitter tags)

## First admin

After the build, sign up once on the admin login page and I will grant that account the admin role so you can start uploading.
