import * as dotenv from "dotenv";
import fs from "fs";
import { start } from "./server.js";
import { createlogger } from "./utility/logger.js";
import { createAdmin } from "./utility/serverutils.js";
import { loadconfig } from "../config/loadconfig.js"

const logger = createlogger();

async function startApp() {
  logger.notice("Initilising Server");
  const server = await start();
  await createAdmin();
}

loadconfig();
startApp()