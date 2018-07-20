FROM node:9.11.1-slim@sha256:ec1bc675cbcb0c5215af40c7c1b7a8ea9d5f17b084eaf7b4b4e69e0963a38f26

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
