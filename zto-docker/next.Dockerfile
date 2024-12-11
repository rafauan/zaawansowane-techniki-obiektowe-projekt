# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY ./zto-next/package*.json ./

# Install dependencies
RUN npm install
