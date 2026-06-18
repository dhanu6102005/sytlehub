# StyleHub 🛍️

A full-stack fashion e-commerce web application built with React (Vite) + Node.js/Express + MySQL + Firebase Auth.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MySQL |
| Auth | Firebase Authentication |
| Styling | CSS / React |

## Project Structure

```
sytlehub/
├── frontend/     # React + Vite app
└── backend/      # Node.js + Express API
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL
- Firebase project

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Fill in your Firebase config in .env
npm run dev
```

## Environment Variables

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.

### Backend (`backend/.env`)
- `PORT` — Server port (default: 5000)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — MySQL credentials
- `JWT_SECRET` — Secret key for JWT tokens
- `CLIENT_URL` — Frontend URL for CORS
- `VITE_FIREBASE_*` — Firebase project configuration

### Frontend (`frontend/.env`)
- `VITE_FIREBASE_*` — Firebase project configuration
- `VITE_API_URL` — Backend API base URL

## License

MIT
