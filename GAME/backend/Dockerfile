FROM node:20-alpine

WORKDIR /app

# Needed for correct timezone/DST (SQLite localtime + Node Intl)
RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4999
CMD ["npm", "run", "dev"]
