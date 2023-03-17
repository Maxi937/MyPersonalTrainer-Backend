import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import inert from "@hapi/inert";
import Cookie from "@hapi/cookie"
import Handlebars from "handlebars";
import Joi from "joi";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./models/db.js";
import createlogger from "../config/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createlogger();

// Load Config File
dotenv.config({ path: "./config/config.env" });

async function init() {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      files: {
        relativeTo: path.join(__dirname, "public")
      },
    }
  });

  // Plugins
  await server.register(Vision);
  await server.register(inert)
  await server.register(Cookie);
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

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
        directory: {
            path: ".",
            redirectToSlash: true
        }
    }
});


  // Start Server
  await server.start();
  logger.info(`Server running on ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});

init();
