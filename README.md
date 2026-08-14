# PetPal 🐾

A full-stack pet sitting application that connects pet owners with trusted pet sitters. Book care for your pets or offer your sitting services — all in one place.

## Features

### Pet Owners
- Sign up and log in
- Register and manage pets (name, type, breed, age, notes)
- Browse and search available pet sitters
- Book pet sitting services with date range and service type
- View and cancel bookings

### Pet Sitters
- Sign up and create a sitter profile
- Set bio, location, hourly rate, and services offered
- Configure weekly availability slots
- Accept, decline, or complete booking requests

### Both Roles
- Role-based dashboards with stats and quick actions
- Booking management with status tracking (pending → accepted/declined → completed)
- Modern, responsive UI built with React and Tailwind CSS

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, React Router, Tailwind CSS |
| Backend  | Node.js, Express                    |
| Auth     | JWT (JSON Web Tokens)               |
| Storage  | JSON file (`backend/data/db.json`)  |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd Frontend
npm install
```

### 2. Start the backend

```bash
cd backend
npm start
```

The API runs at **http://localhost:3001**. A health check is available at `GET /api/health`.

### 3. Start the frontend

```bash
cd Frontend
npm run dev
```

The app opens at **http://localhost:5173**. API requests are proxied to the backend automatically.

## Usage Flow

1. **Sign up** as a Pet Owner or Pet Sitter at `/signup`
2. **Owners**: Add pets → Browse sitters → Book a service
3. **Sitters**: Complete your profile → Set availability → Accept booking requests
4. Both roles can track bookings at `/bookings`

## API Endpoints

| Method | Endpoint                    | Description              | Auth   |
|--------|-----------------------------|--------------------------|--------|
| POST   | `/api/auth/signup`          | Register new user        | No     |
| POST   | `/api/auth/login`           | Log in                   | No     |
| GET    | `/api/auth/me`              | Get current user         | Yes    |
| GET    | `/api/pets`                 | List owner's pets        | Owner  |
| POST   | `/api/pets`                 | Add a pet                | Owner  |
| PUT    | `/api/pets/:id`             | Update a pet             | Owner  |
| DELETE | `/api/pets/:id`             | Delete a pet             | Owner  |
| GET    | `/api/sitters`              | List all sitters         | Yes    |
| GET    | `/api/sitters/me`           | Get sitter profile       | Sitter |
| PUT    | `/api/sitters/me`           | Update sitter profile    | Sitter |
| GET    | `/api/bookings`             | List user's bookings     | Yes    |
| POST   | `/api/bookings`             | Create booking           | Owner  |
| PATCH  | `/api/bookings/:id/status`  | Update booking status    | Yes    |

## Project Structure

```
PetPal/
├── README.md
├── backend/
│   ├── server.js           # Express entry point
│   ├── db.js               # JSON file storage helpers
│   ├── middleware/
│   │   └── auth.js         # JWT middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pets.js
│   │   ├── sitters.js
│   │   └── bookings.js
│   └── data/
│       └── db.json         # Auto-created on first run
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/client.js
        ├── context/AuthContext.jsx
        ├── components/
        └── pages/
```

## Limitations & Next Steps

- **File-based storage** — suitable for development/demo; use PostgreSQL or MongoDB for production
- **No email verification or password reset**
- **No payment processing**
- **No real-time notifications** — users must refresh to see booking updates
- **No image uploads** for pets or sitter profiles
- **No reviews/ratings** system

Potential enhancements: messaging between owners and sitters, calendar integration, push notifications, admin panel, and mobile app.

## License

MIT
