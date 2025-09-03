# RenThing

> The all-in-one rental marketplace for the Philippines

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/built%20with-Next.js-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)](https://www.typescriptlang.org/)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## About

RenThing is a modern web application for the Philippines, enabling users to list, browse, and book items for rent. Whether you need tools, vehicles, electronics, or event equipment, RenThing makes renting easy, secure, and accessible.

## Features

- **Browse Listings:** Discover a wide range of items for rent.
- **User Authentication:** Secure registration and login for renters and owners.
- **Booking System:** Book items for specific dates and manage your bookings.
- **Chat:** Communicate directly with owners or renters.
- **Payment Integration:** Pay securely in Philippine Peso (₱) via Stripe and Xendit.
- **Responsive Design:** Works on desktop and mobile.
- **Search & Filters:** Quickly find what you need.
- **Booking History:** View and manage your past and upcoming rentals.

## Tech Stack

- [Next.js](https://nextjs.org/) (React framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Database for production deployments)
- [Prisma](https://www.prisma.io/) (Database ORM for local development)
- [Stripe](https://stripe.com/) & [Xendit](https://www.xendit.co/) for payments

## Screenshots

> _Add screenshots of your app here (e.g. homepage, booking flow, chat, etc.)_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1. Clone the repository:
	```sh
	git clone https://github.com/yourusername/renthing.git
	cd renthing
	```
2. Install dependencies:
	```sh
	pnpm install
	```
3. Copy `.env.example` to `.env.local` and update values as needed.

### Running Locally

```sh
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root and configure the following:

```env
# For local development with SQLite
DATABASE_URL=file:./dev.db

# For production deployments with Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_key

# Other required variables
STRIPE_SECRET_KEY=your_stripe_secret
XENDIT_API_KEY=your_xendit_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Usage

- List your items for rent
- Browse and book available items
- Chat with owners/renters
- Manage your bookings and payments

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.