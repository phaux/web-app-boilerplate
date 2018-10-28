FROM node:alpine
RUN npm install es-serve --global
WORKDIR /srv

COPY package*.json /srv/
RUN npm install

COPY . /srv/
RUN npm run build
RUN npm install --only=prod

CMD ["es-serve"]
EXPOSE 8000
