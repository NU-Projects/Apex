FROM node:lts-alpine3.23
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm","run","dev"]
