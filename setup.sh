#!/bin/bash
set -a

if [ -f .env ]; then
    echo "[INFO] .env file found, sourcing and building the docker containers"
    source .env
    goto build
else
    echo "[INFO] No .env file found, creating one..."
    
    touch .env
    echo "# DO NOT EDIT THIS FILE MANUALLY, USE setup.sh INSTEAD" >> .env

    #ask for the environment variables
    read -p "Enter the JWT_SECRET: " JWT_SECRET
    read -p "enter the MONGO_INITDB_ROOT_USERNAME: " MONGO_INITDB_ROOT_USERNAME
    read -p "Enter the MONGO_INITDB_ROOT_PASSWORD: " MONGO_INITDB_ROOT_PASSWORD
    read -p "Enter the MONGO_INITDB_DATABASE: " MONGO_INITDB_DATABASE
    read -p "Enter the MONGODB_USERNAME (this will be used by the backend): " MONGODB_USERNAME
    read -p "Enter the MONGODB_PASSWORD (this will be used by the backend): " MONGODB_PASSWORD
    read -p "Enter the MONGODB_HOST: " MONGODB_HOST
    read -p "Enter the MONGODB_PORT: " MONGODB_PORT
    read -p "Enter the API_PORT: " API_PORT
    

    echo "JWT_SECRET"=$JWT_SECRET >> .env
    echo "MONGO_INITDB_ROOT_USERNAME"=$MONGO_INITDB_ROOT_USERNAME >> .env
    echo "MONGO_INITDB_ROOT_PASSWORD"=$MONGO_INITDB_ROOT_PASSWORD >> .env
    echo "MONGO_INITDB_DATABASE"=$MONGO_INITDB_DATABASE >> .env
    echo "MONGODB_USERNAME"=$MONGODB_USERNAME >> .env
    echo "MONGODB_PASSWORD"=$MONGODB_PASSWORD >> .env
    echo "MONGODB_HOST"=$MONGODB_HOST >> .env
    echo "MONGODB_PORT"=$MONGODB_PORT >> .env
    echo "API_PORT"=$API_PORT >> .env
fi

echo "[INFO] Environment variables set, generating the MONGODB_URI"

if [ -z "$MONGODB_USERNAME" ] && [ -z "$MONGODB_PASSWORD" ]; then
    MONGODB_URI="mongodb://$MONGODB_HOST:$MONGODB_PORT/$MONGO_INITDB_DATABASE?appName=Backend"
else
    MONGODB_URI="mongodb://$MONGODB_USERNAME:$MONGODB_PASSWORD@$MONGODB_HOST:$MONGODB_PORT/$MONGO_INITDB_DATABASE?appName=Backend\&authSource=$MONGO_INITDB_DATABASE"
fi

sed -i '/MONGODB_URI/d' .env
echo "MONGODB_URI=$MONGODB_URI" >> .env

build:

echo "[INFO] Checking if the mongo-init.js file exists"
if [ -f mongo-init.js ]; then
    echo "[WARNING] mongo-init.js file found, removing it before generating a new one"
    rm mongo-init.js
fi

echo "[INFO] Generating the mongo-init.js file"
mongo_init="db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
print('selected db: ' + db.getName());
db.createUser({
    user: "\"$MONGODB_USERNAME\"",
    pwd: "\"$MONGODB_PASSWORD\"",
    roles: [
        {
            role: \"dbOwner\",
            db: "\"$MONGO_INITDB_DATABASE\""
        }
    ]   
});
print('User created: $MONGODB_USERNAME');"

echo $mongo_init > mongo-init.js

echo "[INFO] Sourcing the environment variables"
source .env

echo "[INFO] Building the docker containers"
docker-compose up --build