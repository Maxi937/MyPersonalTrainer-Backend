import { connectMongo } from "./mongo/connectMongo.js";
import createlogger from "../../config/logger.js";
import { User } from "./mongo/User.js"
import { Place } from "./mongo/Place.js"

const logger = createlogger()


export const db = {
  User: null,
  Place: null,

  init(dbtype) {
    switch (dbtype) {
      case "mongo" :
        this.User = User
        this.Place = Place
        connectMongo();
        break;
      default :
        logger.info("No Db Selected")
    }
  }
}
