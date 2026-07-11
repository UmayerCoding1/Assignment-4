# FixItNow Backend

A REST API for a home-service marketplace platform (FixItNow) where customers can browse services, book technicians, process simulated payments, and leave reviews. Built with **Express 5**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Zod** validation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)

---

## Features

- **JWT Authentication** for secure token-based logins.
- **Role-based access control** (CUSTOMER, TECHNICIAN, ADMIN).
- **Service CRUD** allowing technicians to list services with advanced category, rating, and location filtering.
- **Booking system** managing customer requests mapping natively to technicians.
- **Simulated Payments** allowing seamless checkout emulation without needing active 3rd-party vendor setup.
- **Reviews & ratings** with automatic technician average-rating recalculation dynamically.
- **Admin dashboard** for granular management over system users, overall bookings, and categories.
- **Centralized error handling** via global error handlers wrapping around operational app events and validation constraints.
- **TypeScript & Prisma ORM** powering complete typesafe persistence over PostgreSQL.

---

## Tech Stack

| Layer            | Technology                                   |
| ---------------- | -------------------------------------------- |
| Runtime          | Node.js + TypeScript                         |
| Framework        | Express 5                                    |
| Database         | PostgreSQL via Prisma ORM v7                 |
| Validation       | Zod v4                                       |
| Authentication   | JSON Web Tokens (jsonwebtoken) + bcryptjs    |
| Security         | CORS, cookie-parser                          |
| Dev Tooling      | tsx, TypeScript 7                            |

---

## Project Structure

```text
assignment_4/
├── prisma/
│   ├── schema/              # Multi-file Prisma schema mapping
│   │   ├── schema.prisma    # Generator + datasource
│   │   ├── enum.prisma      # Core enums
│   │   ├── user.prisma
│   │   ├── technicianProfile.prisma
│   │   ├── service.prisma
│   │   ├── category.prisma
│   │   ├── booking.prisma
│   │   ├── payment.prisma
│   │   └── review.prisma
├── src/
│   ├── app.ts               # Express app route registration & middleware
│   ├── server.ts            # Entry listener setup
│   ├── config/              # Internal configuration mapping via dotenv
│   ├── lib/                 # Prisma client setups
│   ├── middlewares/         # auth(), validation filters, global error handling
│   ├── utils/               # catchAsync, AppError layouts
│   ├── validations/         # Base shared structures
│   └── modules/             # Primary domain features
│       ├── admin/
│       ├── auth/
│       ├── booking/
│       ├── category/
│       ├── payment/
│       ├── review/
│       ├── service/
│       └── technician/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Active PostgreSQL Database instance connection string.

### Installation

```bash
# 1. Clone the repository and jump in
cd assignment_4

# 2. Install dependencies
npm install

# 3. Create your environment file (.env) populated with keys
# PORT=5000
# DATABASE_URL=postgresql://user:pass...

# 4. Generate the Prisma client
npx prisma generate

# 5. Run internal database sync mapping
npx prisma db push

# 6. Start the development server
npm run dev
```

The server natively hooks onto `http://localhost:5000`.

---

## Available Scripts

| Script             | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `npm run dev`      | Start the app using `tsx watch src/server.ts`                      |
| `npm run build`    | Compiles the TypeScript configurations targeting `/dist`           |
| `npm start`        | Run the native production compilation entry block                  |

---

## API Reference

Base Address Extension context typically expects `/api`.

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Categories (`/api/categories`)
- `GET /` — Fetch available global categories (Public)

### Services (`/api/services`)
- `GET /` — List global services supporting `Rating`, `Location`, and `Type` filters.
- `GET /:id` — Get specified service.
- `POST /`, `PATCH /:id`, `DELETE /:id` — Authorized Technician lifecycle.

### Technicians (`/api/`)
- `GET /technicians` — Public collection fetch representing available Technicians.
- `GET /technicians/:id` — Target specific profile rendering out matching user reviews.
- `PUT /technician/profile` & `PUT /technician/availability` — (Auth: TECHNICIAN)

### Bookings (`/api/bookings`)
- `POST /` — Produce a standard structured customer booking.
- `GET /` & `GET /:id` — Read state logic natively scaling validation checks between Customers/Admins.

### Payments (`/api/payments`)
- `POST /create` & `POST /confirm` — Gateway simulators assigning transaction mapping identifiers natively into persistence payloads.
- `GET /` — Protected payment collections wrapper.

### Reviews (`/api/reviews`)
- `POST /` — Validates Booking `COMPLETED` parity prior to updating unified Technician average rating statistics natively.

### Admin Tools (`/api/admin`)
- `GET /users` & `PATCH /users/:id` — Toggling User Status
- `GET /bookings` & `GET /categories` — Full un-scoped collections
- `POST /categories` — Generating master categories natively requiring Admin authentication.

---

## Authentication & Authorization

Protected application routes filter through `auth()` middlewares that natively wrap token verifications scaling payloads natively rendering back into Express handlers as `req.user`. Validation limits users out cleanly upon mismatch or absence.

---

## Error Handling

Standardized configurations propagate back via generic shapes. Validation schemas driven via `zod` populate `errorSources` uniformly natively intercepting `catchAsync` operational hooks to cleanly report out issues sequentially.

---

## License

ISC
