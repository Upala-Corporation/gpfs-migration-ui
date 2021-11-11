#!/bin/sh

echo "REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL"
sed "s|Object({NODE_ENV:\"production\",PUBLIC_URL:\"\",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_API_BASE_URL|\"$REACT_APP_API_BASE_URL\"|g" -i /usr/share/nginx/html/static/js/*

echo "REACT_APP_OAUTH_URL=$REACT_APP_OAUTH_URL"
sed "s|Object({NODE_ENV:\"production\",PUBLIC_URL:\"\",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_OAUTH_URL|\"$REACT_APP_OAUTH_URL\"|g" -i /usr/share/nginx/html/static/js/*

echo "REACT_APP_OAUTH_REDIRECT_URI=$REACT_APP_OAUTH_REDIRECT_URI"
sed "s|Object({NODE_ENV:\"production\",PUBLIC_URL:\"\",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_OAUTH_REDIRECT_URI|\"$REACT_APP_OAUTH_REDIRECT_URI\"|g" -i /usr/share/nginx/html/static/js/*

echo "REACT_APP_OAUTH_CLIENT_ID=$REACT_APP_OAUTH_CLIENT_ID"
sed "s|Object({NODE_ENV:\"production\",PUBLIC_URL:\"\",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_OAUTH_CLIENT_ID|\"$REACT_APP_OAUTH_CLIENT_ID\"|g" -i /usr/share/nginx/html/static/js/*

echo "REACT_APP_BASE_URL=$REACT_APP_BASE_URL"
sed "s|Object({NODE_ENV:\"production\",PUBLIC_URL:\"\",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_BASE_URL|\"$REACT_APP_BASE_URL\"|g" -i /usr/share/nginx/html/static/js/*

# Configure nginx
envsubst '${NGINX_API_PROXY_PASS}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/tmp.conf
mv /etc/nginx/conf.d/tmp.conf /etc/nginx/conf.d/default.conf
cat /etc/nginx/conf.d/default.conf 
# Start nginx
exec nginx -g "daemon off;" 