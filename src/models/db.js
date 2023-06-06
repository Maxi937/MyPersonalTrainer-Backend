import { connectMongo } from "./mongo/connectMongo.js";
import { createlogger } from "../../config/logger.js";
import { User } from "./mongo/User.js"
import { encryptPassword } from "../utility/encrypt.js";

const logger = createlogger()

export const db = {
  User: null,

  init(dbtype) {
    switch (dbtype) {
      case "mongo":
        this.User = User
        connectMongo();
        break;
      default:
        logger.info("No Db Selected")
    }
  },
}