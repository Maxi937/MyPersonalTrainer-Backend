import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import Bell from "@hapi/bell";
import Handlebars from "handlebars";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { validate } from "./api/jwt-utils.js";
import { db } from "./models/db.js";
import { createlogger } from "../config/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { adminRoutes } from "./admin-routes.js";
import { createAdmin, responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createlogger();

// Load Config File
let config = "";

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "aws") {
  config = dotenv.config({ path: "./config/dev.env" });
} else if (process.env.NODE_ENV === "production") {
  config = dotenv.config({ path: "production.env" });
} else if (process.env.NODE_ENV === "devprod") {
  config = dotenv.config({ path: "./config/production.env" });
}

if (config.error) {
  console.log(config.error);
  process.exit(1);
}

logger.info(`Server started: ${new Date()}`);
logger.info("Config Configured");

const swaggerOptions = {
  info: {
    title: "MyPersonalTrainer API",
    version: "0.1",
  },
};

logger.info("Swagger Configured");

async function init() {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  // Plugins
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(Bell);
  await server.register(jwt);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  server.validator(Joi);

  logger.info("Plugins Registered");

  // Views;
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  logger.info("View Engine Loaded");

  // Extend Server to get response time of a request and log to console
  responseTimes(server);
  logger.info("Response Times Loaded");

  // Set up Cookie auth
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });

  // Set up Bell auth
  const bellAuthOptions = {
    provider: "github",
    password: "github-encryption-password-secure",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.BELL_SECRET,
    isSecure: false,
  };

  server.auth.strategy("github-oauth", "bell", bellAuthOptions);

  // Set up JWT auth
  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("session");

  // Connect to Mongo Database
  db.init("mongo");
  logger.info("DB Configured");

  // Set Routes
  server.route(webRoutes);
  server.route(apiRoutes);
  server.route(adminRoutes);
  logger.info("Routes Configured");

  // Start Server
  await server.start();
  logger.info(`Server running on ${server.info.uri}`);
  await createAdmin()
}

process.on("unhandledRejection", (err) => {
  logger.error(err.message);
  process.exit(1);
});

init();
