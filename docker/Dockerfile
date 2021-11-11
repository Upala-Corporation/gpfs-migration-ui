# Stage 1 - build step
FROM node:14 as react-build
WORKDIR /app
COPY package.json package.json
RUN yarn config set registry https://repo1.uhc.com/artifactory/api/npm/npm-virtual
RUN yarn
COPY . ./
RUN yarn build

# Stage 2 - deploy
FROM nginx:alpine

RUN apk upgrade busybox

WORKDIR /etc/nginx
# Setting nginx configuration
COPY ./docker/default.conf ./conf.d/default.conf
COPY ./docker/nginx.conf ./nginx.conf
COPY --from=react-build /app/build /usr/share/nginx/html
COPY ./docker/entrypoint.sh /etc/nginx/entrypoint.sh

RUN addgroup archivergroup && adduser -g archivergroup -D archiveruser

RUN touch /var/run/nginx.pid && \
  chown -R archiveruser:archivergroup /var/run/nginx.pid && \
  chown -R archiveruser:archivergroup /var/cache/nginx && \
  chown -R archiveruser:archivergroup /usr/share/nginx/html && \
  chown -R archiveruser:archivergroup /etc/nginx


USER archiveruser

# Creating new entrypoint that replaces fake environment variables with real values
RUN chmod +x /etc/nginx/entrypoint.sh && dos2unix /etc/nginx/entrypoint.sh

# Starting up the server
ENTRYPOINT ["sh", "entrypoint.sh", "/usr/share/nginx/html"]
