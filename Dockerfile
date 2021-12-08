FROM node:12-alpine
ENV NODE_ENV=development
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .
RUN npm run build

CMD [ "node", "build/index.js" ]