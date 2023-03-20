import { connectMongo } from "./mongo/connectMongo.js";
import { createlogger } from "../../config/logger.js";
import { User } from "./mongo/User.js"
import { Place } from "./mongo/Place.js"
import { Beer } from "./mongo/Beer.js"
import { Review } from "./mongo/Review.js"

const logger = createlogger()


export const db = {
  User: null,
  Place: null,
  Beer: null,

  init(dbtype) {
    switch (dbtype) {
      case "mongo" :
        this.Beer = Beer
        this.User = User
        this.Place = Place
        this.Review = Review
        connectMongo();
        break;
      default :
        logger.info("No Db Selected")
    }
  }
}
