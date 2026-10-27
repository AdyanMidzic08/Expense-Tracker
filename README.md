# Expense Tracker App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-v16+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v5-gray.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A modern, full-stack expense tracking and financial management web application built with **Next.js (App Router)**, **Express (TypeScript)**, **MySQL**, and **Docker**. Track payment records, manage custom categories, authenticate securely, and gain clear visibility over your personal or business cash flow.

---

## Project Index

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Docker Setup (Recommended)](#docker-setup-recommended)
  - [Manual Local Setup](#manual-local-setup)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Comprehensive Expense & Payment Management**: Create, list, inspect, edit, and delete payment transactions with status tracking (`Paid`, `Pending`, `Cancelled`).
- **Category Categorization**: Organize transactions into dynamic categories to classify expenses systematically.
- **User Authentication**: Secure user registration and login workflows with password hashing via `bcryptjs` and stateless session verification using `JSON Web Tokens (JWT)`.
- **Responsive & Polished UI**: Built using Next.js 16, React 19, Tailwind CSS, Lucide icons, MUI components, and Recharts.
- **Developer-Friendly API Dashboard**: Built-in interactive Tailwind-styled endpoint dashboard served at the backend root (`/`).
- **Seamless Containerization**: Full Docker & Docker Compose setup connecting Next.js, Express, and MySQL out-of-the-box with persistent data volumes.

---

## Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Recharts](https://recharts.org/), Lucide Icons |
| **Backend** | [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), `tsx`, `mysql2` |
| **Auth & Security** | [JWT (jsonwebtoken)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), CORS |
| **Database** | [MySQL 8.0](https://www.mysql.com/) |
| **DevOps** | [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) |

---

## Project Structure

```text
expense-tracker-app/
├── docker-compose.yml          # Multi-container orchestration (MySQL, Server, Client)
├── README.md                   # Project documentation
│
├── client/                     # Next.js frontend application
│   ├── app/                    # Next.js App Router
│   │   ├── categories/         # Category listing, creation & editing views
│   │   ├── payments/           # Payment listing, creation & editing views
│   │   ├── login/              # User authentication: Login page
│   │   ├── register/           # User authentication: Register page
│   │   ├── components/         # Reusable UI components & layouts (Navbar, buttons, etc.)
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main dashboard / landing page
│   │   └── global.css          # Global styling & Tailwind CSS imports
│   ├── hooks/                  # Custom React hooks (e.g., useBreakpoint)
│   ├── lib/                    # Client-side utility functions and mock data
│   ├── types/                  # TypeScript interface declarations
│   ├── Dockerfile              # Frontend container image definition
│   └── package.json            # Frontend dependencies and scripts
│
└── server/                     # Express TypeScript backend application
    ├── src/
    │   ├── config/             # Database connection pool setup (MySQL)
    │   ├── middleware/         # Custom Express middleware & API test utilities
    │   ├── types/              # Backend TypeScript types and schemas
    │   └── app.ts              # Express app entrypoint, routes & endpoints
    ├── schema.sql              # Database schema initialization script
    ├── testData.sql            # Optional demo/seed dataset
    ├── Dockerfile              # Backend container image definition
    └── package.json            # Backend dependencies and scripts
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed locally:

- [Git](https://git-scm.com/)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/) *(recommended)*
- Alternatively for local run: [Node.js](https://nodejs.org/) (v20+) and a running [MySQL](https://www.mysql.com/) 8.0 instance.

---

### Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adyanmidzic/expense-tracker-app.git
   cd expense-tracker-app
   ```

2. **Configure Backend Environment Variables:**
   Create a `.env` file inside the `server/` directory:
   ```env
   PORT=3001
   DB_HOST=db
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=expense_tracker
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **(Optional) Seed Test Data:**
   If you want pre-populated sample payments and categories, uncomment the `testData.sql` volume line in [docker-compose.yml](docker-compose.yml) before starting the database for the first time:
   ```yaml
   - ./server/testData.sql:/docker-entrypoint-initdb.d/testData.sql
   ```

4. **Start the containers:**
   ```bash
   docker compose up --build
   ```

5. **Access the application:**
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API & Dashboard**: [http://localhost:3001](http://localhost:3001)
   - **MySQL Database**: `localhost:3306`

---

### Manual Local Setup

<details>
<summary>Click to view manual installation steps without Docker</summary>

#### 1. Database Setup
1. Start your local MySQL server.
2. Run `server/schema.sql` to initialize the database tables:
   ```bash
   mysql -u root -p < server/schema.sql
   ```

#### 2. Backend Setup
```bash
cd server
npm install
# Set DB_HOST=localhost and your credentials in server/.env
npm run dev
```
The server will run at [http://localhost:3001](http://localhost:3001).

#### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
The web client will be available at [http://localhost:3000](http://localhost:3000).

</details>

---

## API Reference

### Overview Dashboard
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Web dashboard detailing server health and available endpoints |

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user (`email`, `password`) |
| `POST` | `/api/login` | Authenticate user credentials and return a signed JWT |

### Payments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/payments` | Retrieve all payment records (ordered by creation date) |
| `GET` | `/api/payments/:id` | Retrieve a single payment record by ID |
| `POST` | `/api/payments` | Create a new payment record |
| `PUT` | `/api/payments/:id` | Update an existing payment record |
| `DELETE` | `/api/payments/:id` | Remove a payment record |

### Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all expense categories |
| `GET` | `/api/categories/:id` | Retrieve a category by ID |
| `POST` | `/api/categories` | Create a new category |
| `PUT` | `/api/categories/:id` | Update an existing category |
| `DELETE` | `/api/categories/:id` | Delete a category |

---

## Roadmap

- [x] Initial full-stack scaffolding with Express, Next.js, and MySQL
- [x] Docker & Docker Compose integration
- [x] CRUD operations for payments and categories
- [x] User registration & JWT authentication endpoint implementation
- [ ] Protected routes & middleware verification on protected endpoints
- [ ] Interactive financial analytics charts (monthly spending, trends, category breakdowns)
- [ ] Export transactions to CSV / PDF formats
- [ ] Budgeting alerts & threshold notifications
- [ ] Dark/Light mode theme toggle support

---

## Contributing

Contributions are always welcome! Whether it's reporting a bug, proposing a new feature, or submitting code improvements:

1. **Fork** the repository.
2. **Create your feature branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "feat: Add AmazingFeature"
   ```
4. **Push to the branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request** describing your changes and motivations.

Please make sure your code follows the repository's ESLint rules and TypeScript types before submitting.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
