import { connectMongo } from "./mongo/connectMongo.js";
import logger from "../utility/logger.js";
import { encryptPassword } from "../utility/encrypt.js";
import { User } from "../features/user/user-model.js";
import { Trainer } from "../features/trainer/trainer-model.js";
import PhotoStorage from "./supabase/PhotoStorage.js";

export const db = {
  User: null,
  PhotoStorage: null,
  Connection: null,

  async initialiseDb(dbType) {
    switch (dbType) {
      case "mongoDB":
        this.User = User;
        this.Trainer = Trainer;
        this.Connection = await connectMongo();
        break;
      default:
        logger.error("No DB Selected");
    }
    this.PhotoStorage = new PhotoStorage();
    this.createAdmin();
  },

  async createAdmin() {
    const adminDetails = {
      fname: process.env.ADMINISTRATOR_FNAME,
      lname: process.env.ADMINISTRATOR_LNAME,
      email: process.env.ADMINISTRATOR_EMAIL,
      password: await encryptPassword(process.env.ADMINISTRATOR_PASSWORD),
      role: "admin",
    };

    try {
      let admin = await this.User.findOne({ role: adminDetails.role });

      if (!admin) {
        logger.warn("No Database Administrator Found. Creating deafult admin user.");
        admin = await new db.User(adminDetails);
        admin.save();
      }
    } catch (err) {
      logger.error("Unable to create admin user");
    }
  },
};

export async function validateAccount(request, session) {
  const user = await db.User.getById(session.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
