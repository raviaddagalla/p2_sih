.PHONY: dev seed test build clean

dev:
	@echo "Starting ChainShield locally..."
	@echo "Backend: http://127.0.0.1:8000"
	@echo "Frontend: http://localhost:3000"

seed:
	cd backend && ./venv/Scripts/python.exe -m app.seed.seed_data

test:
	cd backend && ./venv/Scripts/python.exe -m pytest

build:
	cd frontend && npm run build
