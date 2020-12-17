FROM node:current-alpine as build
WORKDIR /app
COPY package.json /app/
RUN apk add yarn python alpine-sdk && yarn install
COPY . /app/
ARG VUE_APP_BACKEND_URL
ENV VUE_APP_BACKEND_URL $VUE_APP_BACKEND_URL
ARG VUE_APP_AUTH
ENV VUE_APP_AUTH $VUE_APP_AUTH
RUN yarn run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
ENV PORT 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
