FROM node:9.11.1-slim@sha256:8af8ba19dc651ed8b263efa2ea41af964d08e85b342eb7b7f98aa88fcbb674b7

EXPOSE 3000

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .
CMD [ "npm", "start" ]
