# Checklist Frontend

This is the React frontend for the Checklist Management System.

Quick start

1. Copy `.env.example` to `.env` and set REACT_APP_API_BASE_URL
2. npm install
3. npm start

Build & Docker

- `npm run build` to produce production files in `build/`.
- A multi-stage `Dockerfile` is provided to build and serve the app via nginx.

Environment

- REACT_APP_API_BASE_URL - e.g. http://localhost:8000/api/v1

Testing

- `npm test` runs Jest + React Testing Library tests.

Notes

- Uses TailwindCSS for styling.
- Axios instance in `src/api/axiosInstance.js` handles JWT in localStorage.
