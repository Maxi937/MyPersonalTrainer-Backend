import axios from "axios";
import { connectMongo } from "./mongo/connectMongo.js";
import { createlogger } from "../../config/logger.js";
import { User } from "./mongo/User.js"
import { Place } from "./mongo/Place.js"
import { Beer } from "./mongo/Beer.js"
import { Review } from "./mongo/Review.js"
import { Like } from "./mongo/Like.js"
import { encryptPassword } from "../utility/encrypt.js";

const logger = createlogger()

async function createAdmin() {
  const admin = {
    "fname": "Matthew",
    "lname": "Hornby",
    "email": "mhornby123@gmail.com",
    "password": await encryptPassword("admin"),
    "role": "admin"
  }

  const adminUser = await User.findOne({ role: admin.role })
  if (!adminUser) {
    logger.info("admin created")
    const response = await axios.post(`${process.env.url}/api/users`, admin);
    logger.info(response.status)
  }
}

export const db = {
  User: null,
  Place: null,
  Beer: null,
  Like: null,
  Review: null,

  init(dbtype) {
    switch (dbtype) {
      case "mongo":
        this.Beer = Beer
        this.User = User
        this.Place = Place
        this.Review = Review
        this.Like = Like
        connectMongo();
        createAdmin()
        break;
      default:
        logger.info("No Db Selected")
    }
  },
}