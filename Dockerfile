# our base image
FROM node:4-onbuild

# Install dependencies
RUN npm install

# tell the port number the container should expose
EXPOSE 3000

# Launch application
CMD ["node","index"]
