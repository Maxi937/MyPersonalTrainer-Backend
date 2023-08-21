import Mongoose from "mongoose";
import logger from "../../utility/logger.js";

export async function connectMongo() {
  Mongoose.set("strictQuery", true);

  Mongoose.connect(process.env.MONGODB_URI);
  const db = Mongoose.connection;

  db.on("error", (err) => {
    logger.error(`Database connection error: ${err}`);
  });

  db.on("disconnected", () => {
    logger.info("Database disconnected");
  });

  db.once("open", function () {
    logger.info(`Datase connected to ${this.name} on ${this.host}`);
  });
  return db;
}
