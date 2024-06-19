FROM node:14.15.4-alpine3.12 as build
WORKDIR /app

# from here... angular project is ../angular/<project>
# build the angular project (launch the angular build)
COPY angular/package*.json ./
RUN npm install
COPY angular/. .
RUN npm run build