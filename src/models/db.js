import { connectMongo } from "./mongo/connectMongo.js";
import { createlogger } from "../utility/logger.js";
import { User } from "./mongo/User.js";
import Photo from "./supabase/Photo.js";

const logger = createlogger();

export const db = {
  User: null,
  PhotoStorage: null,

  init(dbtype) {
    switch (dbtype) {
      case "mongo":
        this.User = User;
        connectMongo();
        break;
      default:
        logger.info("No Db Selected");
    }

    this.PhotoStorage = new Photo()
  },
};
