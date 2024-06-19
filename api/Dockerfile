FROM node:18
RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY src src
COPY seed-data seed-data
COPY tsconfig.json .

RUN npm install
RUN npm install -g ts-node

EXPOSE 3000
CMD ["npm","run","container"]
