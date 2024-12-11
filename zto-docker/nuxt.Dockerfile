# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY ./zto-nuxt/package*.json ./

# Install dependencies
RUN npm install

# Expose the port Nuxt.js will run on
EXPOSE 3001
