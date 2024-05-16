import { configDotenv } from "dotenv";
import logger from "./logger";

configDotenv();

if(!process.env.API_PORT) {
     logger.error('No port specified');
     process.exit(1);
}

if(!process.env.MONGODB_URI) {
     logger.error('No MongoDB URI specified');
     process.exit(1);
}

if(!process.env.JWT_SECRET) {
     logger.error('No JWT secret specified');
     process.exit(1);
}

export default {
    jwtSecret: process.env.JWT_SECRET,
    apiPort: process.env.API_PORT,
    mongodbUri: process.env.MONGODB_URI
};
