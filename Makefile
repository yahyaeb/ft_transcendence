.PHONY: all up down re clean

all:
	docker compose up -d --build

up:
	docker compose up -d

down:
	docker compose down

re: down all

clean:
	docker compose down -v --rmi all
