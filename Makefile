.PHONY: help build up down logs test ci

help:
	@echo "Makefile targets: build, up, down, logs, test, ci"

build:
	cd backend && docker build -t checklist-backend .

up:
	docker-compose up -d --build

down:
	docker-compose down

logs:
	docker-compose logs -f

test:
	# Run Django tests inside a virtualenv or container
	cd backend && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt && python manage.py test

ci: test
