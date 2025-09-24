
# SaaS Notes (Unified Next.js App)

This is a unified Next.js app that includes both:

- Frontend (React UI in `pages/index.js`)
- Backend API routes (in `pages/api/*`)

## Features
- Multi-tenancy with tenant isolation (shared schema with tenantId)
- JWT-based authentication
- Roles: Admin & Member
- Subscription gating (Free: 3 notes, Pro: unlimited)
- Endpoints:
  - GET /api/health
  - POST /api/auth/login
  - CRUD /api/notes
  - POST /api/tenants/:slug/upgrade (Admin only)
  - POST /api/tenants/:slug/invite (Admin only)

## Test Accounts
All passwords are `password`.

- admin@acme.test (Admin, Acme)
- user@acme.test (Member, Acme)
- admin@globex.test (Admin, Globex)
- user@globex.test (Member, Globex)

## Deployment
1. Push this project to GitHub
2. Import to Vercel as a Next.js project
3. Set environment variable `JWT_SECRET`
4. Deploy
