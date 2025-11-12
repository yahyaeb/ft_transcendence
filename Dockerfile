FROM nginx:latest

EXPOSE 8080


ENTRYPOINT ["nginx", "-g", "daemon off;"]
