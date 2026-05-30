# Employee Management System (Full Stack)

This repository contains a full-stack Employee Management System:

- Backend: Django + Django REST Framework + PostgreSQL + JWT auth
- Frontend: React + TypeScript + Vite + Material UI

This document is the single project README for architecture, setup, and API usage.

## 1) Architecture and DB Design (Brief)

### Architecture approach

Backend is organized by domain apps:

- `accounts`: authentication and user role model
- `companies`: company CRUD
- `departments`: department CRUD and company-scoped uniqueness
- `employees`: employee CRUD and profile access
- `core`: shared pagination, exceptions, validators

Implementation style in backend:

- `views.py`: HTTP layer
- `selectors.py`: read/query logic
- `services.py`: write/business operations
- `permissions.py`: access rules

Frontend is a React SPA:

- Role-aware routing and navigation
- JWT-based auth session
- API communication via Axios
- Server-state via TanStack Query
- Forms via React Hook Form + Zod

### RBAC model

- `ADMIN`: full access
- `HR_MANAGER`: company-scoped access
- `EMPLOYEE`: own profile-oriented access

### Database design / schema considerations

Main entities:

- `User` (custom auth user)
  - fields include `role`, optional `assigned_company`
- `Company`
  - one-to-many with `Department`
  - one-to-many with `Employee`
- `Department`
  - belongs to one `Company`
  - unique constraint: `(name, company)`
- `Employee`
  - one-to-one with `User` via `employee_profile`
  - belongs to one `Company`
  - optional `Department`
  - unique `email`

Pagination is standardized as:

```json
{
  "count": 120,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": []
}
```

## 2) Local Setup Instructions

## Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 14+

## 2.1 Clone and enter project

```powershell
cd C:\path\to\your\workspace
git clone <your-repo-url>
cd eben
```

## 2.2 Backend setup (Django)

1. Create PostgreSQL database (example name used by project):

```sql
CREATE DATABASE employee_management;
```

2. Create and configure backend environment file:

```powershell
cd backend
copy .env.example .env
```

3. Edit `backend/.env` and ensure values are correct for your machine:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`

4. Install Python dependencies and run migrations:

```powershell
cd ..
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.venv\Scripts\python.exe backend\manage.py migrate
```

5. (Optional) Create admin user:

```powershell
.venv\Scripts\python.exe backend\manage.py createsuperuser
```

6. Start backend:

```powershell
.venv\Scripts\python.exe backend\manage.py runserver 127.0.0.1:8000
```

## 2.3 Frontend setup (React)

1. Install dependencies and configure env:

```powershell
cd frontend
npm install
copy .env.example .env
```

2. Verify `frontend/.env` contains:

```env
VITE_API_URL=http://localhost:8000/api
```

3. Start frontend:

```powershell
npm run dev
```

Frontend default URL: `http://localhost:5173`

## 2.4 Build checks

```powershell
cd frontend
npm run build
```

## 3) API Documentation

Base API prefix:

- `http://localhost:8000/api/`

Interactive docs:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI schema: `http://localhost:8000/api/schema/`

Use Swagger UI for complete request/response schemas.

### Auth endpoints

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

Request login example:

```json
{
  "username": "admin",
  "password": "AdminPass123!"
}
```

Auth header for protected endpoints:

```http
Authorization: Bearer <access_token>
```

### Company endpoints

- `GET /api/companies/`
- `POST /api/companies/`
- `GET /api/companies/{id}/`
- `PATCH /api/companies/{id}/`
- `DELETE /api/companies/{id}/`

### Department endpoints

- `GET /api/departments/`
- `POST /api/departments/`
- `GET /api/departments/{id}/`
- `PATCH /api/departments/{id}/`
- `DELETE /api/departments/{id}/`

Common query parameter:

- `company` for filtering departments by company
  - example: `GET /api/departments/?company=1`

### Employee endpoints

- `GET /api/employees/`
- `POST /api/employees/`
- `GET /api/employees/{id}/`
- `PATCH /api/employees/{id}/`
- `DELETE /api/employees/{id}/`
- `GET /api/employees/me/` (current authenticated employee profile)

### Common query parameters

- `page`
- `page_size`

Example:

- `GET /api/employees/?page=1&page_size=25`

### Example employee response

```json
{
  "id": 1,
  "user_id": 7,
  "full_name": "Jane Doe",
  "company_id": 1,
  "department_id": 2,
  "email": "jane.doe@example.com",
  "mobile": "+201234567890",
  "address": "Cairo",
  "title": "HR Specialist",
  "hire_date": "2026-04-12",
  "is_active": true,
  "created_at": "2026-05-30T10:20:00Z",
  "updated_at": "2026-05-30T10:20:00Z",
  "days_employed": 48
}
```

### Error format

Typical error envelope:

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "detail": {
      "field": ["message"]
    }
  }
}
```

## 4) Practical Troubleshooting

- If backend fails on startup with DB errors, verify PostgreSQL is running and `backend/.env` DB values are correct.
- If frontend cannot load data, verify backend is running at `127.0.0.1:8000` and `VITE_API_URL` matches.
- If auth fails, clear local storage in browser and log in again.

## 5) Project Structure

```text
eben/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── companies/
│   │   ├── departments/
│   │   ├── employees/
│   │   └── core/
│   ├── config/
│   │   ├── settings/
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```
