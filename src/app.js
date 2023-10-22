import { start } from "./server/server.js";
import logger from "./utility/logger.js";
import { loadconfig } from "../config/loadconfig.js";


loadconfig();
const server = await start();


