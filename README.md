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
| Storage  | MongoDB (Mongoose)                  |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

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

### 2. Configure environment variables

Create a `.env` file in the `backend/` directory (or copy from the example):

```bash
cd backend
cp .env.example .env
```

Then set your MongoDB connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/petpal
JWT_SECRET=your-long-random-secret
```

### 3. Start the backend

```bash
cd backend
npm start
```

The API runs at **http://localhost:3001**. A health check is available at `GET /api/health`.

### 4. Start the frontend

```bash
cd Frontend
npm run dev
```

The app opens at **http://localhost:5173**. API requests are proxied to the backend automatically.

## Deploying to Render

This project is configured for **single-service deployment** on Render, where the Express backend serves both the API and the built React frontend.

### Option A: Render Blueprint (recommended)

1. Push this repository to GitHub.
2. In the Render Dashboard, click **New → Blueprint**.
3. Select the repository. Render will detect the `render.yaml` configuration.
4. You'll be prompted to set two environment variables:
   - `MONGODB_URI` — your MongoDB connection string (e.g. from MongoDB Atlas)
   - `JWT_SECRET` — a long random secret string
5. Click **Apply**. Render will build and deploy the app automatically.

### Option B: Manual Web Service

1. Push this repository to GitHub.
2. In the Render Dashboard, click **New → Web Service**.
3. Connect your repository.
4. Configure:
   - **Name**: `petpal`
   - **Runtime**: `Node`
   - **Build Command**: `cd Frontend && npm install && npm run build && cd ../backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Health Check Path**: `/api/health`
5. Add environment variables:
   - `MONGODB_URI` (your MongoDB connection string)
   - `JWT_SECRET` (a long random secret)
6. Click **Create Web Service**.

### Getting a MongoDB URI (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user.
3. Add your IP address to the network access list (or allow all `0.0.0.0/0` for testing).
4. Click **Connect → Drivers** and copy the connection string.
5. Paste it as the `MONGODB_URI` value.

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
├── render.yaml              # Render deployment config
├── backend/
│   ├── server.js            # Express entry point
│   ├── db.js                # MongoDB connection
│   ├── .env.example         # Environment variable template
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── SitterProfile.js
│   │   └── Booking.js
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   └── routes/
│       ├── auth.js
│       ├── pets.js
│       ├── sitters.js
│       └── bookings.js
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

- **No email verification or password reset**
- **No payment processing**
- **No real-time notifications** — users must refresh to see booking updates
- **No image uploads** for pets or sitter profiles
- **No reviews/ratings** system

Potential enhancements: messaging between owners and sitters, calendar integration, push notifications, admin panel, and mobile app.

## License

MIT
