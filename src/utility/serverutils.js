import os from "os";
import { db } from "../models/db.js";
import { createlogger } from "./logger.js";
import { encryptPassword } from "./encrypt.js";

const logger = createlogger();

export async function createAdmin() {
  const adminDetails = {
    fname: process.env.ADMINISTRATOR_FNAME,
    lname: process.env.ADMINISTRATOR_LNAME,
    email: process.env.ADMINISTRATOR_EMAIL,
    password: await encryptPassword(process.env.ADMINISTRATOR_PASSWORD),
    role: "admin",
  };

  const duplicate = await db.User.findOne({ role: adminDetails.role });

  if (!duplicate) {
    logger.warn("No Database Administrator Found. Creating deafult admin user.");
    const admin = await new db.User(adminDetails);

    try {
      admin.save();
    }
    catch (err) {
      logger.error("Unable to create admin user")
      console.log(err.message)
    }
  }
}

export async function responseTimes(server) {
  server.ext("onRequest", (request, h) => {
    request.headers["x-req-start"] = new Date().getTime();
    return h.continue;
  });

  server.ext("onPreResponse", (request, h) => {
    const start = parseInt(request.headers["x-req-start"], 10);
    const end = new Date().getTime();
    if (!request.response.isBoom) {
      request.response
        .header("x-req-start", start)
        .header("x-res-end", end)
        .header("x-response-time", end - start)
        .header("Server", os.hostname());
      logger.info(`${request.method.toUpperCase()}: ${request.path} - ${request.response.headers["x-response-time"]} ms`);
    }
    return h.continue;
  });
}
