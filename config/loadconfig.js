import * as dotenv from "dotenv";
import { createlogger } from "../src/utility/logger.js";

const logger = createlogger();

// Load Config File
export function loadconfig() {
  const enviroment = process.env.NODE_ENV;
  let config = "";

  switch (enviroment) {
    case "production":
      config = dotenv.config({ path: "production.env" });
      break;
    case "devprod":
      config = dotenv.config({ path: "./config/production.env" });
      break;
    default:
      config = dotenv.config({ path: "./config/dev.env" });
  }

  if (config.error || config === "") {
    console.log("Config Error");
    process.exit(1);
  }
}
