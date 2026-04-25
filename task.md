# Dashboard Consolidation Task

## Goal

Single /dashboard route. Role-based tabs/content. Delete /official, /admin routes.

## Access Matrix

| Role                   | Dashboard access | What they see                                     |
| ---------------------- | ---------------- | ------------------------------------------------- |
| official               | YES              | Publish Notices tab                               |
| official + isAdmin     | YES              | Notices + all admin tabs                          |
| student (isCR=true)    | YES              | Approve student registrations (same session only) |
| student (isAdmin=true) | YES              | Everything                                        |
| teacher                | NO               | Redirect to / after login                         |
| any isAdmin=true       | YES              | Everything                                        |

## Tabs (sidebar nav items)

- **Notices** — officials + admins → publish/manage notices
- **Student Approvals** — CR (same session) + admins → approve pending students
- **Manage Courses** — admins only
- **Manage Users** — admins only (approve teachers/officials, block/unblock)

## Data / Models needed

1. **Notice model** — title, body, date, attachment(url), type(event|notice|exam|other), publishedBy, createdAt
2. **API: POST /api/notices** — create notice (official or admin)
3. **API: GET /api/notices** — public, for /notice-board page
4. **API: DELETE /api/notices/[id]** — official/admin
5. **API: GET /api/users?role=student&status=pending&session=X** — CR fetches pending students of same session
6. **API: PATCH /api/users/[id]/status** — CR/admin flips pending→active (CR restricted to same session)

## Steps

1. Create Notice model
2. Create Notice API routes
3. Create /dashboard page (unified, role-aware)
4. Update dashboard layout — guard: no access for teachers (unless isAdmin), redirect to /
5. Update sidebar — show tabs based on role+isAdmin
6. Build tab components: PublishNotices, StudentApprovals
7. Update /notice-board page to fetch real data
8. Delete /official and /admin route folders
9. Update Navbar dashboard link → /dashboard
10. Typecheck + lint + commit + push

## Status

- [ ] Notice model
- [ ] Notice API
- [ ] /dashboard page
- [ ] Dashboard layout guard
- [ ] Sidebar tabs
- [ ] PublishNotices component
- [ ] StudentApprovals component
- [ ] /notice-board real data
- [ ] Cleanup old routes
- [ ] Typecheck/push
