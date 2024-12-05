FROM node:20

WORKDIR /app

COPY app/package*.json ./

RUN npm install

COPY app .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000
EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
