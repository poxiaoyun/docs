FROM nginx:alpine
LABEL MAINTAINER="xiaoshi"
WORKDIR /usr/src/app
ENV LISTEN_PORT=8080
ENV DOCS_BASE_URL=/docs

COPY dist dist
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
