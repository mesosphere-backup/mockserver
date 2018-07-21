FROM node:9.11.1-slim@sha256:a4016b922cca10ddfb7114490209cfcd704ce86962cf21b84fdc51b4404b8804

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
