FROM nginx:alpine
LABEL MAINTAINER="xiaoshi"
WORKDIR /usr/src/app
ENV API_SERVER=http://rune-api LISTEN_PORT=8080
COPY dist dist
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
