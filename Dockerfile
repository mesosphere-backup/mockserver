FROM node:9.11.1-slim@sha256:c34fba4d68ddea60b5a773c3a3e8dcc33b2b63ffe8d7a5f023ddbb42106cd0df

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
