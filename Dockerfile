FROM node:20-alpine

WORKDIR /app

COPY build ./build

RUN npm install express

COPY ssl ./ssl

COPY server.js ./server.js

EXPOSE 3000

CMD ["node", "server.js"]