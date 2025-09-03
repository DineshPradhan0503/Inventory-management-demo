# Inventory Management System (Spring Boot + MongoDB + React)

Professional full‑stack inventory management app with authentication, role‑based authorization, product and stock management, sales tracking, reporting/analytics, export (Excel/PDF/CSV), and audit logging.

## Stack
- Backend: Spring Boot 3, MongoDB, Spring Security (JWT), Lombok, Validation, Springdoc OpenAPI, Apache POI (Excel), OpenPDF (PDF)
- Frontend: React + Vite + TypeScript, Material UI, Redux Toolkit, React Router, Axios, Recharts, React Hook Form + Zod

## Features
- Auth: Register/Login/Logout, JWT with roles (ADMIN/USER), session expiry
- Products (ADMIN): CRUD, stock increase/decrease, soft delete, low‑stock alerting
- Sales (ADMIN/USER): Record sales with validation and automatic stock deduction, history
- Reports (ADMIN): Stock report, sales summaries (daily/weekly/monthly), charts on UI, export to Excel/PDF/CSV
- Audit logs (ADMIN): Who did what and when (product changes, sales, report exports)

Default admin is seeded on first run: username `admin`, password `Admin@123`.

## Prerequisites
- Java 17+ (JDK 21 is fine)
- Node.js 18+ and npm
- MongoDB running (local or cloud)

## Quick Start
1) Backend
- Set environment variables (examples below)
- From `inventory-backend`:
```
./apache-maven-3.9.8/bin/mvn spring-boot:run
```
- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

2) Frontend
- From `inventory-frontend`:
```
npm install
cp .env.example .env   # set VITE_API_URL accordingly
npm run dev
```
- UI: `http://localhost:5173` (default Vite port)

## Environment
Backend (via environment variables):
- `MONGODB_URI` (e.g., `mongodb://localhost:27017/inventorydb`)
- `JWT_SECRET` (32+ chars; plain or Base64)
- `JWT_EXPIRATION_MS` (default 3600000)

Frontend (`inventory-frontend/.env`):
- `VITE_API_URL` (e.g., `http://localhost:8080/api`)

## Usage Walkthrough
1) Login/Register
- Open UI and register a user or log in as admin (`admin` / `Admin@123`).
- Token is stored in localStorage; Axios attaches it for API calls.

2) Products (ADMIN)
- Create/Edit/Delete products; low stock highlighted in red.
- Increase/Decrease stock with quick actions.
- Search and sort (name/price/stock) client‑side.

3) Sales
- Record sales; product stock decreases automatically.
- View sales history (admin view). Validation prevents overselling.

4) Reports (ADMIN)
- View low‑stock bar chart and best‑sellers pie chart.
- Export CSV from UI (client‑side) and download Excel/PDF from backend endpoints.

5) Audit Logs (ADMIN)
- View audit trail of product changes, sales records, and report exports.

## API Highlights
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Products: `GET /api/products` (public read), `POST/PUT/DELETE /api/products` (ADMIN), `POST /api/products/{id}/increase|decrease?qty=` (ADMIN)
- Sales: `POST /api/sales` (ADMIN/USER), `GET /api/sales` (ADMIN)
- Reports (JSON): `GET /api/reports/stock`, `GET /api/reports/sales?period=daily|weekly|monthly`
- Reports (Export):
  - Excel: `GET /api/reports/stock.xlsx`, `GET /api/reports/sales.xlsx?period=weekly`
  - PDF: `GET /api/reports/stock.pdf`, `GET /api/reports/sales.pdf?period=weekly`
- Audit: `GET /api/audit` (ADMIN)

## Verification Checklist
- Auth
  - Register a new user, login, logout; token expires as configured.
  - Admin can access all admin routes; regular user cannot access admin‑only routes.
- Products
  - Create a product; edit price/category/description; delete (soft delete).
  - Increase/decrease stock; low‑stock alert triggers when stock ≤ threshold.
  - List supports search/sort in UI.
- Sales
  - Record sale decreases product stock; disallow if insufficient stock.
  - Sales listing visible to admin.
- Reports
  - Stock JSON shows totals and low‑stock items; sales summary respects period.
  - UI charts render; CSV/Excel/PDF exports download successfully.
- Audit
  - Product create/update/delete, stock changes, sales record, report exports appear in audit list.

## Notes & Future Enhancements
- Server‑side filtering/pagination: Current product listing uses in‑service filtering; for large datasets, add Mongo queries and pageable endpoints.
- Role‑aware navigation: Hide admin links for non‑admins (can be added in UI).
- Email alerts: Add low‑stock email notifications if SMTP is configured.

## Troubleshooting
- 401 Unauthorized: Ensure JWT present; re‑login.
- 403 Forbidden: Role does not permit the action.
- Mongo connectivity: Verify `MONGODB_URI` and database availability.
- PDF/Excel downloads: Ensure backend is reachable from browser and CORS not blocked.

## License
Internal/learning project. Replace or add a proper license if needed.
