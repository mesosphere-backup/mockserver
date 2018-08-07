FROM node:9.11.1-slim@sha256:aec2d754ceb952d440079d5c2436e8bae8697ea374cb54fc44aed43e078ea1c1

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
