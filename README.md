# DriveFix Auto Service

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0b1220)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000?style=for-the-badge&logo=resend&logoColor=white)

DriveFix Auto Service is a portfolio-ready workshop web app for booking vehicle service appointments, browsing maintenance parts, managing a parts cart, and starting a secure Stripe Checkout flow. The project is built as a modern full-stack Next.js application with a feature-oriented source structure, Prisma-backed booking data, server-side validation, and optional email notifications.

## Screenshots

Replace these placeholders with production screenshots before publishing the final portfolio entry.

| Home | Booking |
| --- | --- |
| ![Home page screenshot placeholder](docs/screenshots/home.svg) | ![Booking page screenshot placeholder](docs/screenshots/booking.svg) |

| Shop | Cart |
| --- | --- |
| ![Shop page screenshot placeholder](docs/screenshots/shop.svg) | ![Cart page screenshot placeholder](docs/screenshots/cart.svg) |

## Features

- Responsive workshop landing page with branded service positioning and hero imagery.
- Service booking flow with date, time, customer details, server-side validation, and Prisma persistence.
- Booking status model for pending, confirmed, in-progress, completed, and cancelled appointments.
- Optional Resend-powered booking notification email for the workshop inbox.
- Parts shop with category, vehicle brand, and model filtering.
- Client-side cart with quantity controls, persisted local storage, subtotal calculation, and checkout status handling.
- Stripe Checkout route that rebuilds line items from the trusted server-side catalog.
- Shared layout, navigation, brand constants, validation schemas, and feature-specific components.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **UI:** React 19, Tailwind CSS 4
- **Database:** PostgreSQL with Prisma 7
- **Validation:** Zod
- **Payments:** Stripe Checkout
- **Email:** Resend
- **Tooling:** ESLint 9, npm, JavaScript modules, path alias via `@/*`

## Project Structure

```text
.
|-- prisma/                 # Prisma schema, config, and seed data
|-- public/images/          # Portfolio hero and parts catalog imagery
|-- src/app/                # App Router pages, layout, and API route handlers
|-- src/components/         # Shared layout and presentation components
|-- src/features/           # Booking, cart, home, and shop feature modules
|-- src/lib/                # Brand config, db client, email, Stripe, and validation helpers
|-- package.json            # Scripts and dependencies
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 20.9 or newer
- npm
- PostgreSQL database
- Stripe test secret key for checkout testing
- Resend API key and verified sender email if you want email notifications

### Installation

```bash
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

Update `.env` with your local credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
STRIPE_SECRET_KEY="sk_test_replace_me"
RESEND_API_KEY="re_replace_me"
EMAIL_FROM="DriveFix Auto Service <bookings@example.com>"
```

Sync the Prisma schema and seed the workshop services:

```bash
npx prisma db push
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - start the Next.js development server.
- `npm run build` - create a production build.
- `npm run start` - run the production server after building.
- `npm run lint` - run ESLint.
- `npm run prisma:generate` - generate the Prisma client.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `STRIPE_SECRET_KEY` | For checkout | Stripe secret key used by the `/api/checkout` route. |
| `RESEND_API_KEY` | For email | Enables Resend booking notification delivery. |
| `EMAIL_FROM` | For email | Verified sender address for Resend email delivery. |

Keep real secrets in `.env` only. The committed `.env.example` file should contain placeholders.

## Portfolio Notes

This project demonstrates full-stack product work across App Router pages, server actions, route handlers, database persistence, third-party checkout, email integration, form validation, and responsive UI composition. For a finished portfolio listing, add real screenshots to `docs/screenshots/` and replace the placeholder images referenced above.
