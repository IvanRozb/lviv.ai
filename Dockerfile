FROM node:latest AS builder

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm run test_build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

EXPOSE 443
EXPOSE 80

RUN rm -rf *

COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]

