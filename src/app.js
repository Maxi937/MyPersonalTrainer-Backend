import { start } from "./server/server.js";
import { createlogger } from "./utility/logger.js";
import { loadconfig } from "../config/loadconfig.js";
import { db } from "./database/db.js";


const logger = createlogger();
loadconfig();

const server = await start();


