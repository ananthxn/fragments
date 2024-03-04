# Use node version 18.13.0
# FROM node:20.11.0
FROM node:20-alpine3.19@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c AS dependencies

LABEL maintainer="Ananthakrishnan Arunkuamr <aarunkumar@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false


# Use /app as our working directory
WORKDIR /app

# Option 1: explicit path - Copy the package.json and package-lock.json
# files into /app. NOTE: the trailing `/` on `/app/`, which tells Docker
# that `app` is a directory and not a file.
COPY package*.json ./

# Install node dependencies defined in package-lock.json
#RUN npm install

RUN npm ci --only=production

############################################################
FROM node:20-alpine3.19@sha256:c0a3badbd8a0a760de903e00cedbca94588e609299820557e72cba2a53dbaa2c

WORKDIR /app

COPY --from=dependencies /app/node_modules /node_modules

COPY package.json package-lock.json ./

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm", "start"]

# We run our service on port 8080
EXPOSE 8080
