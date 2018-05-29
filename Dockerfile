FROM node:alpine
RUN mkdir /app/
WORKDIR /app/
RUN npm install es-serve@0.5 --global
COPY package*.json /app/
RUN npm install --prod
COPY . /app/
CMD ["es-serve", "--index-fallback", "--rewrite-imports"]
EXPOSE 8000
