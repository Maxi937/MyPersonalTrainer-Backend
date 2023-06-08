import * as dotenv from "dotenv";
import Hapi from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import Bell from "@hapi/bell";
import Handlebars from "handlebars";
import jwt from "hapi-auth-jwt2";
import HapiSwagger from "hapi-swagger";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";
import { validate } from "./api/jwt-utils.js";
import { db } from "./models/db.js";
import { createlogger } from "./utility/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { adminRoutes } from "./admin-routes.js";
import { responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./controllers/accounts-controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logger = createlogger();

// Load Config File
const enviroment = process.env.NODE_ENV

let config = "";

switch(enviroment) {
  case "production":
    config = dotenv.config({ path: "production.env" });
    break;
  case "devprod":
    config = dotenv.config({ path: "./config/production.env" });
    break;
  default:
    config = dotenv.config({ path: "./config/dev.env" });
}

if (config.error || config === "" ) {
  console.log("Config Error");
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "MyPersonalTrainer API",
    version: "0.1",
  },
};

const bellAuthOptions = {
  provider: "github",
  password: "github-encryption-password-secure",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.BELL_SECRET,
  isSecure: false,
};

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

// Extend Server to get add response time to headers
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

// Set Routes
server.route(webRoutes);
server.route(apiRoutes);
server.route(adminRoutes);

process.on("unhandledRejection", (err) => {
  logger.error(err.message);
  process.exit(1);
});

export async function start() {
  await server.start();
  return server;
}
