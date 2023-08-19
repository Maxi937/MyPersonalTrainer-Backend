import { start } from "./server/server.js";
import logger from "./utility/logger.js";
import { loadconfig } from "../config/loadconfig.js";
import { db } from "./database/db.js";



loadconfig();

const server = await start();


