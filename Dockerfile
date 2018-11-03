FROM node:alpine AS build
WORKDIR /srv

COPY package*.json /srv/
RUN npm install

ENV NODE_ENV production
COPY . /srv/
RUN npm run build

FROM pierrezemb/gostatic
WORKDIR /srv/http

COPY --from=build /srv/index.html /srv/http/
COPY --from=build /srv/app /srv/http/app

CMD ["-fallback", "index.html", "-port", "80"]
EXPOSE 80
