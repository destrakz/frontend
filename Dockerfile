FROM nginx:alpine

COPY ./src /usr/share/nginx/flowermeadowgenerator
COPY ./src /etc/nginx/html

EXPOSE 80
