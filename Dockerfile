FROM node:9.11.1-slim@sha256:be210cdf7be8321f5fd9227024de09491e21ee8d16452125c5894bab70892f91

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
