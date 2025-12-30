.PHONY: all up down re clean

all:
	docker compose up -d --build

up:
<<<<<<< HEAD
	cd GAME/backend && npm i @fastify/multipart @fastify/static
	docker-compose up -d --build
=======
	docker compose up -d
>>>>>>> origin/Game_v2

down:
	docker compose down

re: down all

clean:
	docker compose down -v --rmi all
