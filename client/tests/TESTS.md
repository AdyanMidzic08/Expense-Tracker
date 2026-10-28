# Frontend Tests Documentation

This document describes the architecture, configuration, helper functions, database test data, and execution of the End-to-End frontend tests for the Expense Tracker web application.

---

## 1. Directory Structure (`client/tests/`)

```
client/tests/
├── testData.ts         # Parses and exports test data from server/testData.sql
├── helpers.ts          # Central helper functions (Authentication, API mocks, Navigation)
├── auth.spec.ts        # Tests for Login, Registration, Logout & Route Protection
├── crud.spec.ts        # Dedicated test suite with describes for POST, PUT & DELETE
├── dashboard.spec.ts   # Tests for Dashboard KPIs (Revenue, Invoices, Categories) & Tables
├── payments.spec.ts    # Tests for Payments list, Categories list & Diagram visualisations
└── TESTS.md            # This documentation file
```

---

## 2. Dedicated CRUD Test Suite (`crud.spec.ts`)

The file [`crud.spec.ts`](./crud.spec.ts) thoroughly tests all state-modifying operations (**POST**, **PUT**, **DELETE**) for both **Categories** and **Payments**, structured with clear `test.describe` blocks:

### a) `test.describe('Categories CRUD')`:

- **`POST`**: Submits a new category via `/categories/new`, asserts the request payload (`{ name: '...' }`), and verifies the redirect.
- **`PUT`**: Navigates to `/categories/edit/[id]`, ensures inputs are pre-filled with values from `testData.sql`, updates the category name, and validates the outgoing `PUT` payload.
- **`DELETE`**: Clicks the delete icon in `/categories`, automatically intercepts and accepts the `window.confirm` dialog, dispatches the `DELETE` request, and verifies that the item is instantly removed from the UI.

### b) `test.describe('Payments CRUD')`:

- **`POST`**: Fills out the `/payments/new` invoice form (client, amount, status, category select) and validates the intercepted `POST` request payload.
- **`PUT`**: Edits an existing invoice at `/payments/edit/[id]`, changes client name and amount, validates the `PUT` request body, and checks redirection back to `/payments`.
- **`DELETE`**: Clicks the delete button in the payments table, accepts the confirmation alert, triggers the `DELETE` API call, and validates that the row is removed from the table.

---

## 3. Database Test Data from `server/testData.sql` (`testData.ts`)

The file [`testData.ts`](./testData.ts) dynamically reads and parses the real database seed file [`server/testData.sql`](../../server/testData.sql):

- **Categories (5 items)**:
  - `Software & Tools` (ID 1)
  - `Cloud & Hosting` (ID 2)
  - `Design & Media` (ID 3)
  - `Marketing` (ID 4)
  - `Hardware` (ID 5)
- **Payments / Invoices (15 items)**:
  - `INV-2026-001` through `INV-2026-015`
  - Total Paid Revenue (`Paid`): **$3,566.97**
  - Pending Invoices (`Pending`): **3**
  - Cancelled Invoices (`Cancelled`): **2**

> **Server & Pipeline Reliability**: If the SQL file cannot be resolved directly inside an isolated Docker container or CI runner, `testData.ts` automatically falls back to an embedded identical copy so that server test runs never fail due to relative path issues.

---

## 4. Central Helper Functions (`helpers.ts`)

The [`helpers.ts`](./helpers.ts) module provides modular, reusable utilities for all test specs:

1. **`logInPage(page, options)`**:
   - Opens `/login`, fills in credentials, and clicks the submit button. Intercepts `/api/login` by default to ensure deterministic execution without requiring a live backend service.
2. **`registerPage(page, options)`**:
   - Performs a user registration workflow on `/register` and mocks `/api/register`.
3. **`mockAuthState(page, email, token)`**:
   - Injects authenticated JWT state (`token`, `userEmail`) directly into `localStorage` using `page.addInitScript`, enabling instant direct access to protected routes (`/`, `/payments`, etc.) without repeating UI logins.
4. **`mockDashboardApi(page, data)`**:
   - Mocks `GET /api/categories` and `GET /api/payments` endpoints using the parsed `server/testData.sql` records.
5. **`logOut(page)`**:
   - Triggers the sidebar logout action and verifies redirection to `/login`.

---

## 5. Local Execution

From inside the `client/` directory:

```bash
# Run the entire test suite headless
npm test

# Run only the CRUD operations test suite (POST, PUT, DELETE)
npx playwright test tests/crud.spec.ts

# Run tests with the interactive Playwright UI
npm run test:live

# Run a specific test file
npx playwright test tests/auth.spec.ts
```

---

## 6. Server & CI/CD Pipeline Integration

All 19 tests are 100% deterministic and isolated from external dependencies. They run reliably across macOS, Ubuntu runners, and Docker containers.

Example step for `.github/workflows/ci.yml`:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium
  working-directory: client

- name: Run Frontend E2E Tests
  run: npm test
  working-directory: client
  env:
    CI: true
```
