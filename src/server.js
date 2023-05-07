import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie"
import Handlebars from "handlebars";
import HapiSwagger from "hapi-swagger"
import fs from "fs";
import Joi from "joi";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./models/db.js";
import { createlogger } from "../config/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { adminRoutes } from "./admin-routes.js";
import { responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createlogger();

// Load Config File
let config = ""

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "aws") {
  config = dotenv.config({ path: "./config/config.env" });
}
else if (process.env.NODE_ENV === "production") {
  config = dotenv.config({ path: "production.env" });
}
else if (process.env.NODE_ENV === "devprod") {
  config = dotenv.config({ path: "./config/production.env" });
}

if (config.error) {
  logger.error(config.error)
  logger.info(config.error.message);
  process.exit(1);
}

logger.info(new Date().getDate())
logger.info("Config Configured")

const swaggerOptions = {
  info: {
    title: "PintAccountant API",
    version: "0.1",
  },
};

logger.info("Swagger Configured")

async function init() {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    tls: {
      key: fs.readFileSync("./config/keys/private/webserver.key"),
      cert: fs.readFileSync("./config/keys/webserver.crt")
    }
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

  logger.info("Plugins Registered")

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

  logger.info("View Engine Loaded")

  // Extend Server to get response time of a request and log to console
  responseTimes(server)
  logger.info("Response Times Loaded")

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
  logger.info("Auth Configured")

  // Connect to Mongo Database
  db.init("mongo")
  logger.info("DB Configured")

  // Set Routes
  server.route(webRoutes);
  server.route(apiRoutes);
  server.route(adminRoutes);
  logger.info("Routes Configured")

  // Start Server
  await server.start();
  logger.info(`Server running on ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  logger.error(err.message);
  process.exit(1);
});

init();

