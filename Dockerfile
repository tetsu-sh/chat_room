# Use the official Node.js image as the base image
FROM node:20

RUN npm i -g pnpm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY . /usr/src/app

# Install the application dependencies
RUN pnpm install

# Build the NestJS application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]