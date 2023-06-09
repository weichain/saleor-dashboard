FROM node:19-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
ARG APP_MOUNT_URI
ARG API_URI
ARG STATIC_URL
ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/}
ENV STATIC_URL ${STATIC_URL:-/}

EXPOSE 9000
CMD ["npm", "run", "start"]