# Use official Node.js runtime
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the server
CMD ["npm", "start"]
