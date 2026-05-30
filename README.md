# Employee Management System

Employee Management System is a full-stack HR application for managing users, employee profiles, companies, and departments with role-based access control.

It is split into two applications:

- Backend: Django + Django REST Framework + PostgreSQL + JWT authentication
- Frontend: React + TypeScript + Vite + Material UI + TanStack Query

This README is the main project guide. It explains the architecture, folder layout, setup, API endpoints, and the core user flows.

## Project Overview

The application supports three roles:

- `ADMIN`: full access to everything
- `HR_MANAGER`: can manage employees and related data, with some restrictions on their own profile
- `EMPLOYEE`: can view and update only their own profile details that are safe to edit

Typical use cases:

- manage employee records
- organize employees by company and department
- control access by role
- view the current employee profile
- maintain a clean profile and account structure

## Project Structure

```text
eben/
├─ backend/
│  ├─ manage.py
│  ├─ config/
│  │  ├─ settings/
│  │  │  ├─ base.py
│  │  │  ├─ dev.py
│  │  │  └─ prod.py
│  │  ├─ urls.py
│  │  ├─ asgi.py
│  │  └─ wsgi.py
│  └─ apps/
│     ├─ accounts/
│     ├─ companies/
│     ├─ departments/
│     ├─ employees/
│     └─ core/
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ routes.tsx
│  │  ├─ theme/
│  │  ├─ types/
│  │  ├─ utils/
│  │  └─ main.tsx
│  ├─ package.json
│  └─ vite.config.ts
└─ README.md
```

### Backend app responsibilities

- `accounts`: custom user model, login, tokens, profile identity, and roles
- `companies`: company CRUD and company-level data
- `departments`: department CRUD and company-scoped department logic
- `employees`: employee profile CRUD and profile-specific access rules
- `core`: shared pagination, exceptions, validation helpers, and utility code

### Frontend app responsibilities

- `api`: Axios clients and endpoint wrappers
- `components`: reusable UI components
- `context`: auth and toast state
- `hooks`: server-state hooks and mutations
- `layouts`: shell, navigation, and page chrome
- `pages`: route-level screens
- `routes.tsx`: routing and role-based navigation
- `theme`: Material UI theme configuration
- `utils`: formatting, permissions, constants, storage, and validation helpers

## Architecture

The backend is organized by domain instead of by a single monolithic app. Each domain app typically follows the same pattern:

- `models.py`: database models
- `serializers.py`: DRF serialization and validation
- `views.py`: HTTP request handling
- `urls.py`: endpoint routing
- `permissions.py`: access rules
- `selectors.py`: read/query helpers
- `services.py`: write/business logic

This structure keeps read logic, write logic, and request handling separated so the codebase is easier to maintain as it grows.

The frontend is a single-page application with:

- protected routes
- role-aware navigation
- JWT access and refresh token handling
- API-driven screens using TanStack Query
- controlled forms with React Hook Form and Zod

## Data Model

The main domain entities are:

- `User`
  - custom auth model
  - stores the user role
  - may link to an assigned company
- `Company`
  - top-level organization record
  - has many departments
  - has many employees
- `Department`
  - belongs to one company
  - department names are unique within the same company
- `Employee`
  - employee profile linked to a user account
  - belongs to one company
  - may belong to one department
  - stores contact and employment information

## Role Rules

The application uses role-based permissions to keep profile and admin flows separate.

- `ADMIN`
  - can manage all companies, departments, and employees
  - can edit role and active status fields
  - can access all dashboard data
- `HR_MANAGER`
  - can manage employees and organizational data within the app flow
  - can edit other employees
  - when editing their own profile, restricted fields such as role/company/department are hidden or disabled
- `EMPLOYEE`
  - can view their own profile
  - can update safe personal/account fields on their own profile
  - cannot edit role, company, or department assignment

## Frontend Flow

The main pages are:

- login page
- dashboard page
- employees list and employee form
- employee profile page
- companies list and company form
- departments list and department form

Important behaviors:

- employees land on their profile after login
- admins and HR managers land on the dashboard after login
- employees cannot access the admin dashboard route directly
- the profile page shows the username at the top
- the employee form hides role controls from non-admin users
- employee self-editing is limited to safe profile fields

## Backend API

Base API prefix:

- `http://localhost:8000/api/`

Documentation endpoints:

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI schema: `http://localhost:8000/api/schema/`

### Auth endpoints

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

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

Useful filter:

- `company` filters departments by company
- example: `GET /api/departments/?company=1`

### Employee endpoints

- `GET /api/employees/`
- `POST /api/employees/`
- `GET /api/employees/{id}/`
- `PATCH /api/employees/{id}/`
- `DELETE /api/employees/{id}/`
- `GET /api/employees/me/`

### Pagination

List endpoints use a standard paginated response:

```json
{
  "count": 120,
  "next": "http://localhost:8000/api/employees/?page=2",
  "previous": null,
  "results": []
}
```

Common query parameters:

- `page`
- `page_size`

Example:

```text
GET /api/employees/?page=1&page_size=25
```

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

### Auth header

Protected endpoints require a bearer token:

```http
Authorization: Bearer <access_token>
```

## Local Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository

```powershell
git clone https://github.com/MahmoudHany12/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Backend setup

Create the database:

```sql
CREATE DATABASE employee_management;
```

Copy the environment file:

```powershell
cd backend
copy .env.example .env
```

Update `backend/.env` with your local values:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `DJANGO_SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`

Install dependencies and run migrations:

```powershell
python -m pip install -r requirements.txt
python manage.py migrate
```

Optional admin user:

```powershell
python manage.py createsuperuser
```

Start the backend:

```powershell
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend setup

Open a second terminal:

```powershell
cd frontend
npm install
copy .env.example .env
```

Confirm `frontend/.env` contains:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the frontend:

```powershell
npm run dev
```

Frontend URL:

- `http://localhost:5173`

### 4. Build verification

```powershell
cd frontend
npm run build
```

## Scripts

### Frontend scripts

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check and build production assets
- `npm run preview`: preview the production build
- `npm run lint`: run ESLint
- `npm run typecheck`: run TypeScript type checking only

## Configuration Notes

Backend configuration is driven by `backend/config/settings/base.py` and environment variables loaded from `backend/.env`.

Frontend configuration is driven by `frontend/.env`, especially `VITE_API_URL`.

The app is set up for local development with:

- Django API on port `8000`
- Vite frontend on port `5173`
- CORS enabled for common local origins

## Project Conventions

- API requests are centralized through Axios wrappers
- Server state is managed with TanStack Query rather than ad hoc fetch calls
- Forms use React Hook Form with Zod validation
- Role checks are enforced in routing and in page-level UI logic
- Reusable UI lives in shared components instead of duplicated page code

## Troubleshooting

- If the backend refuses to start, verify PostgreSQL is running and the database name in `.env` exists.
- If the frontend cannot reach the API, check `VITE_API_URL` and the backend CORS settings.
- If a login succeeds but the page redirects incorrectly, clear browser storage and sign in again.
- If you see permission issues, confirm the signed-in user role matches the expected route.

## API Error Shape

Most validation and permission errors are returned in a structured DRF format, usually with a top-level `detail` or field-specific messages. Check Swagger UI for exact payloads on each endpoint.

## License

No license has been specified in this repository yet.

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
