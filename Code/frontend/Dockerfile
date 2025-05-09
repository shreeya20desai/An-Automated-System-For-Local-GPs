# Use an official Node runtime as a parent image
FROM node:18-slim

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app files
COPY . .

# Build your React app
RUN npm run build

# Install a simple HTTP server for serving static files
RUN npm install -g serve

# Expose port 3000 (or your preferred port)
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "build", "-l", "3000"]
