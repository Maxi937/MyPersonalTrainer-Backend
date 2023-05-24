import os from "os";
import axios from "axios";
import { db } from "../models/db.js"
import { createlogger } from "../../config/logger.js";
import { encryptPassword } from "./encrypt.js";


const logger = createlogger()

export async function createAdmin() {
  const adminDetails = {
    "fname": "Matthew",
    "lname": "Hornby",
    "email": "mhornby123@gmail.com",
    "password": await encryptPassword("admin"),
    "role": "admin"
  }

  const duplicate = await db.User.findOne({ role: adminDetails.role })
  if (!duplicate) {
    logger.info("creating admin user")
    const admin = await new db.User(adminDetails);
    admin.save()
  }
}

export async function responseTimes(server) {
  server.ext("onRequest", (request, h) => {
    request.headers["x-req-start"] = (new Date()).getTime();
    return h.continue;
  });

  server.ext("onPreResponse", (request, h) => {
    const start = parseInt(request.headers["x-req-start"], 10);
    const end = (new Date()).getTime();
    if (!request.response.isBoom) {
      request.response
        .header("x-req-start", start)
        .header("x-res-end", end)
        .header("x-response-time", end - start)
        .header("Server", os.hostname())
      logger.info(`${request.method.toUpperCase()}: ${request.path} - ${request.response.headers["x-response-time"]} ms`)
    }
    return h.continue;
  });


}