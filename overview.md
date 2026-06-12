# Job Application Tracker — Features Track

---

## Overview

A user-centric job tracking platform. Users can manage their job application lifecycle, track desired companies, and create/store interview questions with answers.

---

## Tech Stack (Current Implementation)

- **Frontend:** Next.js
- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis
- **UI:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Server State:** TanStack Query
- **HTTP Client:** Axios
- **Monorepo:** Turborepo

---

## Features

### 1. Authentication

- Cookie-based authentication using HTTP-only cookies
- JWT access and refresh token implementation
- Signup, signin, and logout endpoints with full frontend integration
- On logout: clear cookies and invalidate the refresh token (server-side)
- Redis-based refresh token storage and validation
- Proper Passport strategies (JWT strategy + local/refresh strategy as needed)
- Frontend auth state managed via `useAuthStore` hook (Zustand)
- `/me` (or equivalent) endpoint for syncing auth state between frontend and backend
- Signin and signup pages with proper form validation, side-by-side layout with accompanying images
