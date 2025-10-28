### Multi-stage Dockerfile for Django 4.2 using Gunicorn (production-ready)
### Stage: builder -> install wheels & collectstatic
FROM python:3.10-slim AS builder
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# Install build deps for some Python packages (and Postgres client headers if used)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt ./
# Build wheels to speed up final image installs
RUN pip install --upgrade pip setuptools wheel \
    && pip wheel --no-cache-dir -r requirements.txt -w /wheels

# Copy project sources and collect static files into a wheel-backed image
COPY . /app
ENV DJANGO_SETTINGS_MODULE=config.settings
ENV STATIC_ROOT=/app/static
RUN pip install --no-index --find-links=/wheels -r requirements.txt \
    && mkdir -p ${STATIC_ROOT} \
    && python manage.py collectstatic --noinput || true

### Stage: production image (minimal runtime)
FROM python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

# Install minimal runtime deps and tini to handle PID 1 signal forwarding
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 tini ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash django && mkdir -p /app
WORKDIR /app

# Copy pre-built wheels and project files from builder
COPY --from=builder /wheels /wheels
COPY --from=builder /app /app

RUN pip install --upgrade pip \
    && pip install --no-index --find-links=/wheels -r requirements.txt

# Use tini as PID 1 to forward signals and reap processes
ENTRYPOINT ["/usr/bin/tini", "--"]

# Use non-root user for runtime security
USER django

ENV DJANGO_SETTINGS_MODULE=config.settings
ENV PYTHONUNBUFFERED=1
ENV STATIC_ROOT=/app/static

EXPOSE 8000

# Run gunicorn (3 workers by default); override via docker-compose command or CMD
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--log-file", "-", "--log-level", "info"]
