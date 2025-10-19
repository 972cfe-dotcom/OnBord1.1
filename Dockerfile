# Use official Node.js runtime as base image
FROM node:20-slim

# Set maintainer label
LABEL maintainer="your-email@example.com"
LABEL description="Calculator Backend API with Frontend"

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --production --silent && \
    npm cache clean --force

# Copy application code
COPY server.js ./
COPY public/ ./public/

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port 8080 (Google Cloud standard)
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]
