FROM node:18-alpine

WORKDIR /app

COPY blog-api/package*.json ./

RUN npm ci

COPY blog-api .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
