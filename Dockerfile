FROM nginx:alpine

COPY ./src /usr/share/nginx/flowermeadowgenerator
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./src /etc/nginx/html

EXPOSE 80
