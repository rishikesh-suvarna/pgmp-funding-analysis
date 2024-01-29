# Fetching the node 18 image
FROM node:18

# Declaring env
ENV NODE_ENV development
ENV PORT 8000

# Setting up the work directory
WORKDIR /funding-analysis

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install

# Starting our application
CMD [ "node", "app.js" ]

# Exposing server port
EXPOSE 8000