# Project Implementation Plan: Service Request MVP

## Overview
A web-based service request platform connecting clients with local artisans (electricians, plumbers, etc.).
Core features: Service selection, Request submission (date/description), Admin dashboard for manual assignment.

## Tech Stack
-   **Frontend**: Next.js (React)
-   **Styling**: Vanilla CSS (CSS Modules & Global Styles)
-   **Backend**: Next.js API Routes
-   **Database**: SQLite (via `better-sqlite3`) for simplicity and speed.

## 1. Project Initialization
-   [x] Create Next.js app (Running...)
-   [ ] Install dependencies: `better-sqlite3`
-   [ ] Configure Global CSS (Dark mode, glassmorphism)

## 2. Design System
-   **Colors**:
    -   Primary: Deep Blue (`#0f172a`)
    -   Accent: Cyan/Teal (`#06b6d4` to `#3b82f6` gradient)
    -   Text: White/Light Gray (`#f8fafc`, `#cbd5e1`)
    -   Glass: `rgba(255, 255, 255, 0.1)` with backdrop filter.
-   **Components**:
    -   `Card`: Glassmorphic container.
    -   `Button`: Gradient background, hover effects.
    -   `Input`: Transparent with bottom border or neumorphic.

## 3. Data Model (SQLite)
-   **Services Table**: `id`, `name`, `icon` (string), `problems` (JSON string).
-   **Artisans Table**: `id`, `name`, `category` (matches Service name).
-   **Requests Table**: `id`, `service`, `problem`, `date`, `description`, `status` ('pending', 'assigned'), `artisan_id` (FK to Artisan).

## 4. Frontend Implementation
-   **Home Page (`/`)**:
    -   Hero section with title/subtitle.
    -   Grid of services (Electrician, Plumber, Pool, Gardener, Cleaner).
    -   Clicking a service -> navigates to `/request/[service]`.
-   **Request Page (`/request/[service]`)**:
    -   Form:
        -   Service Name (read-only/header)
        -   Problem select (from predefined list)
        -   Date picker
        -   Description textarea
        -   Submit button
-   **Success Page (`/success`)**:
    -   Confirmation message.
-   **Admin Dashboard (`/admin`)**:
    -   Login (simple check).
    -   List of Requests (grouped by verification/assignment status).
    -   Assignment Modal/Dropdown for each unassigned request.

## 5. Backend Implementation
-   `lib/db.js`: Database connection and initialization script.
-   `pages/api/services`: GET list of services.
-   `pages/api/requests`: POST (create), GET (list all).
-   `pages/api/artisans`: GET list of artisans.
-   `pages/api/assign`: POST (assign artisan to request).

## 6. Seed Data
-   Services: Electrician, Plumber, Pisciniste, Jardinier, Femme de menage.
-   Sample Artisans for each category.

## 7. Refinement
-   Animations (Framer Motion or CSS Keyframes).
-   Responsive adjustments.
