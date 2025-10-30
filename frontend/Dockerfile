### Multi-stage Dockerfile for React (Create React App) served by Nginx
FROM node:18-alpine AS builder
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
WORKDIR /app

# Add a non-root user for safety during build steps
RUN addgroup -S app && adduser -S app -G app

# Copy package manifests and install
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install

# Copy source and build app
COPY . .
RUN npm run build

### Production stage: nginx serving static files
FROM nginx:stable-alpine

# # Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# # Copy built assets from builder (CRA outputs to /app/build)
COPY --from=builder /app/build /usr/share/nginx/html

# # Note: nginx config is provided by the separate `nginx` service and is mounted
# # from the repository; do not copy files from outside the build context here.

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
