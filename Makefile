PORT ?= 8080
IMAGE ?= protein-suite
CONTAINER ?= protein-suite

.PHONY: help build up down restart logs serve open

help:
	@printf "Protein Suite targets:\n"
	@printf "  make serve PORT=8080   Serve static files with python3 http.server\n"
	@printf "  make build             Build nginx Docker image\n"
	@printf "  make up PORT=8080      Run nginx container\n"
	@printf "  make down              Stop and remove container\n"
	@printf "  make restart           Restart Docker container\n"
	@printf "  make logs              Show Docker logs\n"
	@printf "  make open PORT=8080    Open local URL with xdg-open\n"

build:
	docker build -t $(IMAGE) .

up:
	docker compose up -d

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f

serve:
	python3 -m http.server $(PORT)

open:
	xdg-open http://127.0.0.1:$(PORT)/
