# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port that your Express.js app will listen on
EXPOSE 3000

# Define the command to start your Express.js server
CMD ["node", "src/index.js"]
