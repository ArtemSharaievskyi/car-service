## 📸 Application Preview

### 📱 Responsive Design
Fully responsive layout for mobile, tablet, and desktop.
<p align="center">
  <img src="https://github.com/user-attachments/assets/4c5a3d8f-426e-43c9-9789-a1b7d6c785e5" width="95%" />

</p>

### 🚗 Home Page
<p align="center">
  <img  src="https://github.com/user-attachments/assets/4fa69cc6-be51-48ae-8e7f-0ae271c6d7ac" width="95%" />
</p>

---

### 🛠 Service Booking
Book car maintenance services such as diagnostics, oil change, and inspection.
<p align="center">
  <img src="https://github.com/user-attachments/assets/5f1ac85e-b0f8-4483-a0bc-c1ea71b04398" width="95%" />
</p>

---

### 🛒 Parts Shop
Browse automotive parts with filtering by brand and model.
<p align="center">
 <img  src="https://github.com/user-attachments/assets/9c770ff0-12f1-4a16-ab44-fad63aed7dfa"  width="95%" />

</p>

---

### 🔎 Product Filtering
Find parts by car brand and model for a realistic shopping experience.
<p align="center">
  <img  src="https://github.com/user-attachments/assets/0f732144-5ee6-4d14-9418-b74e3655ee4d" width="95%" />

</p>

---

### 🧺 Shopping Cart
Add, remove items and view total price.
<p align="center">
 <img  src="https://github.com/user-attachments/assets/313cfd5d-3e31-43f4-9065-3f471e7aca40" width="95%" />
</p>

---
## ⚡ Integrations

### 📧 Resend Email Notifications
Professional transactional email system for handling bookings.

- Sends booking requests directly to the business email  
- Clean, modern HTML email layout  
- Realistic workflow (no public bookings page)  

<p align="center">
 <img  src="https://github.com/user-attachments/assets/8a974114-e108-4098-9cba-687e889c2306" width="95%" />
</p>

---

### 💳 Stripe Checkout
Secure payment integration for the parts shop.

- Stripe Checkout session for cart items  
- Clean redirect-based payment flow  
- Production-ready payment structure  

<p align="center">
  <img src="https://github.com/user-attachments/assets/d111a959-3e38-4833-80f5-9db7d6cf4ca1" width="95%" />
</p>



# DriveFix Auto Service

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0b1220)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000?style=for-the-badge&logo=resend&logoColor=white)

DriveFix Auto Service is a portfolio-ready workshop web app for booking vehicle service appointments, browsing maintenance parts, managing a parts cart, and starting a secure Stripe Checkout flow. The project is built as a modern full-stack Next.js application with a feature-oriented source structure, Prisma-backed booking data, server-side validation, and optional email notifications.


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
