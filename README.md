Checklist App - Dockerized

This repository contains a Django REST backend and a React frontend. This README explains how to build and run the app using Docker Compose for development and production-like environments.

Quick dev (build images and run):

1. Copy env files:
   - cp env/.env.development env/.env

2. Build and run:
   - docker-compose build
   - docker-compose up -d

3. Check logs:
   - docker logs checklist_backend_bf
   - docker logs checklist_frontend_bf

Notes:
- Development uses SQLite by default. For production, set DATABASE_URL in env/.env to a Postgres DSN and use the `db` service.
- The Nginx reverse proxy is configured in `nginx/nginx.conf` and mapped in `docker-compose.yml` (on host port 8080).
- Static files are collected during the backend image build into `/app/staticfiles` and exposed via a Docker volume.

Security & production considerations:
- Replace `DJANGO_SECRET` with a secure random value and never commit secrets.
- Configure HTTPS termination (letsencrypt/SSL) in front of Nginx for public deployments.
- Scale Gunicorn workers based on CPU (we use 3 as a conservative default).
- Use a managed Postgres database or ensure backups for `db_data` volume.
