# PetPal 🐾 — Professional Pet Care Network

A full-stack enterprise-grade pet sitting application connecting pet owners with trusted pet caregivers. Book sitting, walking, and overnight care for your pets, or manage your pet care business — all in one platform.

## Key Features

### Pet Owners
- Account registration & JWT authentication
- Manage pet profiles (name, type, breed, age, special care notes)
- Search & filter verified sitters by city, services, and hourly rates
- Real-time booking financial calculator (days × hourly rate total estimation)
- Booking status tracking (`Pending` → `Accepted` / `Declined` → `Completed`)

### Pet Sitters
- Professional sitter profile management (bio, city autocomplete, hourly rate, services toggles)
- Configure weekly availability slots with time validation
- Manage client booking requests directly from the dashboard
- Quick status action controls (Accept, Decline, Mark Completed)

### Enterprise Application Architecture
- **Persistent Global Layout:** Role-aware top navigation bar with active route indicators and mobile drawer menu.
- **Modern Iconography:** Clean SVG UI icon system using `lucide-react`.
- **System Feedback:** Custom modal dialogs (replacing native `confirm()` popups) and floating toast notifications.
- **Skeleton Loaders:** Smooth loading state transitions for dashboards, grids, and lists.
- **Database Persistence:** MongoDB Mongoose database connection with `.env` configuration and fallback adapter.

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS 3.4, Lucide Icons |
| **Backend** | Node.js, Express 4.x |
| **Database** | MongoDB / Mongoose (with JSON fallback store) |
| **Auth** | JWT (JSON Web Tokens) + Bcrypt password hashing |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)
- MongoDB instance (MongoDB Atlas or local MongoDB daemon)

## Getting Started

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd Frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/petpal
JWT_SECRET=change-me-to-a-long-random-string
PORT=3001
```

### 3. Start the Backend API

```bash
cd backend
npm start
```

The backend server runs at **http://localhost:3001**. Health check is available at `GET /api/health`.

### 4. Start the Frontend Application

```bash
cd Frontend
npm run dev
```

The frontend application opens at **http://localhost:5173**.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new user (Owner or Sitter) | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user context | Authenticated |
| `GET` | `/api/pets` | List owner's registered pets | Owner |
| `POST` | `/api/pets` | Add new pet profile | Owner |
| `PUT` | `/api/pets/:id` | Update pet details | Owner |
| `DELETE` | `/api/pets/:id` | Remove pet profile | Owner |
| `GET` | `/api/sitters` | List available sitters | Authenticated |
| `GET` | `/api/sitters/me` | Fetch current sitter's profile | Sitter |
| `PUT` | `/api/sitters/me` | Update sitter bio, rate, & availability | Sitter |
| `GET` | `/api/bookings` | List user's bookings (Owner or Sitter) | Authenticated |
| `POST` | `/api/bookings` | Request new booking with calculation | Owner |
| `PATCH` | `/api/bookings/:id/status` | Update booking status | Authenticated |

## License

MIT
