# GabibBook
A web application, including a server with REST-style APIs and a SPA front-end, that allows students to buy and sell used university textbooks by creating and bidding on auctions.

## Deployment
Use setup.sh to create the .env file and the mongo-init.js file.
if you already have the .env file and the mongo-init.js file the setup.sh will use the existing ones.
if you only have the .env file the setup.sh will create the mongo-init.js file.

At the end of the setup script `docker compose up --build` will be executed to start the whole project.

### TODO:
As of now, the setup script will not work on windows, as it uses the `sed` command to replace the `MONGO_INITDB_ROOT_PASSWORD` in the mongo-init.js file. This will **NOT** be fixed in the future.

The docker files are not yet ready for the frontend deployment. This will be fixed in the future.