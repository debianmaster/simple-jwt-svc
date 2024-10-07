# Use an official Node.js image based on Alpine Linux
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the app dependencies
RUN npm install --production

# Copy the rest of the app's source code
COPY index.js .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]
