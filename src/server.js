import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie"
import Handlebars from "handlebars";
import HapiSwagger from "hapi-swagger"
import axios from "axios";
import Joi from "joi";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./models/db.js";
import { createlogger } from "../config/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createlogger();

// Load Config File
let config = ""

if (process.env.NODE_ENV === "development"){
  config = dotenv.config({ path: "./config/config.env" });
} 
else if (process.env.NODE_ENV === "production") {
  config = dotenv.config({ path: "production.env" });
}
else if (process.env.NODE_ENV === "devprod") {
  config = dotenv.config({ path: "./config/production.env" });
}

if (config.error) {
    console.log(config.error)
    logger.info(config.error.message);
    process.exit(1);
}


const swaggerOptions = {
  info: {
    title: "PintAccountant API",
    version: "0.1",
  },
};

async function init() {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  // Plugins
  await server.register(Inert)
  await server.register(Vision);
  await server.register(Cookie);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);
  
  // Views;
  server.views({
    engines: {
      hbs: Handlebars
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  // Extend Server to get response time of a request and log to console
  responseTimes(server)

  // Set up Cookies
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.default("session");

  // Connect to Mongo Database
  db.init("mongo")

  // Set Routes
  server.route(webRoutes);
  server.route(apiRoutes);

  // Start Server
  await server.start();
  logger.info(`Server running on ${server.info.uri}`);

  // Create an Admin User if one not there
    const admin = {
      "fname": "Matthew",
      "lname": "Hornby",
      "email": "mhornby123@gmail.com",
      "password": "admin",
      "role": "admin"
    }
    const adminUser = await db.User.findOne({role: admin.role}).lean()
    if (!adminUser) {
      const res = await axios.post(`${process.env.url}/api/users`, admin);
    }
}

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});

init();
