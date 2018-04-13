FROM node:9.11.1-slim

EXPOSE 3000

COPY package*.json ./
RUN npm install

COPY . .
CMD [ "npm", "start" ]
