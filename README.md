# UPMS Frontend

React/Vite frontend for the University Procurement Management System. The app supports role-based procurement workflows for HOD, Bursar, Faculty Bursar, Supplies Division, TEC, Tender Board, Storekeeper, Supplier, Finance Division, and Admin users.

## Tech Stack

- React 18
- Vite 6
- React Router with `HashRouter`
- Tailwind CSS 4
- Radix UI components
- Lucide React icons

## Prerequisites

- Node.js 18 or newer
- npm
- Running backend services, or deployed backend URLs configured in `.env`

## Setup

Install dependencies:

```bash
npm install
```

Create or update `.env`:

```env
VITE_API_BASE_URL=https://your-auth-service.example.com/api
VITE_PROCUREMENT_API_BASE_URL=https://your-procurement-service.example.com/api
```

Current project defaults:

```env
VITE_API_BASE_URL=https://upms-backend-pkbf.onrender.com/api
VITE_PROCUREMENT_API_BASE_URL=https://upms-backend-37xy.onrender.com/api
```

Optional Microsoft sign-in variables:

```env
VITE_MICROSOFT_CLIENT_ID=your-client-id
VITE_MICROSOFT_TENANT_ID=your-tenant-id
VITE_MICROSOFT_SCOPE=openid profile email offline_access User.Read
VITE_MICROSOFT_REDIRECT_URI=http://localhost:5173/#/auth/microsoft/callback
```

## Development

Start the local dev server:

```bash
npm run dev
```

Vite normally serves the app at:

```text
http://localhost:5173
```

Because the app uses `HashRouter`, dashboard URLs look like:

```text
http://localhost:5173/#/dashboard/fin
```

## Build

Create a production build:

```bash
npm run build
```

The build output is written to `dist/`.

## Main Routes

- `/` - Welcome screen
- `/login` - Username/password and Microsoft sign-in
- `/register` - Account request form
- `/waiting` - Pending approval screen
- `/select-role` - Demo role picker
- `/dashboard/:role/*` - Role dashboard

Role slugs:

- `adm` - System Administrator
- `hod` - Head of Department
- `bur` - Main Bursar
- `fbur` - Faculty Bursar
- `sdc` - Supplies Division Clerk
- `tec` - TEC Member
- `tb` - Tender Board Member
- `stk` - Storekeeper
- `sup` - Supplier
- `fin` - Finance Division

## Authentication

Real backend features require signing in through `/login`. The login response stores:

- `upms_auth_token`
- `upms_refresh_token`
- `upms_user`

These values are kept in browser local storage.

The `/select-role` screen is only for demo navigation. It does not create a backend auth token, so database-backed actions such as saving faculty budget allocations will not be available from demo mode.

## Backend Services

This frontend calls two backend API bases:

- `VITE_API_BASE_URL` for authentication and admin user APIs
- `VITE_PROCUREMENT_API_BASE_URL` for procurement, budget allocation, and procurement workflow APIs

Important procurement endpoints used by the frontend:

- `GET /v1/procurement/list`
- `GET /v1/procurement/{id}`
- `POST /v1/procurement/create`
- `PUT /v1/procurement/{id}/update`
- `GET /v1/budget-allocations?fiscalYear=YYYY`
- `POST /v1/budget-allocations`

## Faculty Budget Allocation

Finance Division users can open:

```text
Dashboard -> Manage Faculty Budgets
```

This screen lets Finance allocate procurement budgets faculty-wise. The budget is the money a Faculty Bursar can spend on procurements.

The dropdown includes all university faculties:

- Faculty of Technology
- Faculty of Management Studies and Commerce
- Faculty of Applied Sciences
- Faculty of Medical Sciences
- Faculty of Engineering
- Faculty of Allied Health Sciences
- Faculty of Dental Sciences
- Faculty of Urban Aquatic and Bioresources
- Faculty of Computing
- Faculty of Humanities and Social Sciences

Budget usage rules:

- Pending fund verification requests do not reduce faculty budget.
- Verified and active procurements count as committed budget.
- Completed procurements count as spent budget.
- Rejected, cancelled, and suspended procurements do not reduce available budget.

## Faculty Bursar Fund Verification

Faculty Bursars verify requisitions against the budget allocated by Finance.

The verification screen shows:

- Finance allocation
- Budget code
- Faculty Bursar spend authority
- Requested amount
- Allocated amount
- Remaining balance

The Faculty Bursar cannot verify funds if:

- Finance has not allocated a faculty budget
- the allocation amount exceeds available faculty budget
- the request is outside the Faculty Bursar approval limit

## Project Structure

```text
src/
  app/
    admin/                  Admin dashboard
    api/                    API clients
    auth/                   Auth context and Microsoft login helpers
    components/             Auth/welcome/shared UI screens
    dashboard/
      components/           Dashboard UI components
      hooks/                Dashboard data hooks
      views/                Role-specific dashboard screens
      BudgetContext.tsx     Faculty budget allocation state/API bridge
      ProcurementContext.tsx Procurement state/API bridge
      DashboardLayout.tsx   Shared dashboard shell
      types.ts              Roles, statuses, workflow types
  styles/                   Global styles and Tailwind entrypoints
```

## Deployment

Set the same environment variables in the hosting provider:

```env
VITE_API_BASE_URL=...
VITE_PROCUREMENT_API_BASE_URL=...
```

Then build:

```bash
npm run build
```

Deploy the `dist/` directory.

For Vercel, this project includes `vercel.json`.

## Troubleshooting

If Finance cannot save faculty budgets:

- Make sure the user signed in through `/login`, not `/select-role`.
- Confirm the user has the Finance Division role.
- Confirm `VITE_PROCUREMENT_API_BASE_URL` points to the deployed procurement service.
- Confirm the procurement backend is deployed with the budget allocation endpoints.
- Confirm the procurement backend and auth backend use the same `APP_JWT_SECRET`.

If budget values look negative too early:

- Pending fund verification requests should not count as committed.
- Confirm both frontend and procurement backend are deployed with the latest budget usage calculation.

If the frontend calls the wrong backend:

- Check `.env`
- Rebuild after changing any `VITE_*` variable
- Redeploy the new `dist/` output
