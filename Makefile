.PHONY: all up down re clean

all:
	docker-compose up -d --build

up:
	cd GAME/backend && npm i @fastify/multipart @fastify/static
	docker-compose up -d --build

down:
	docker-compose down

re: down all

clean:
	docker-compose down -v --rmi all
