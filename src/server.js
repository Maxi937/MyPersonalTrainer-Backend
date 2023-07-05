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
import { validate } from "./utility/jwt-utils.js";
import { db } from "./database/db.js";
import { createlogger } from "./utility/logger.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { adminRoutes } from "./admin-routes.js";
import { responseTimes } from "./utility/serverutils.js";
import { accountsController } from "./features/user/user-controller.js";

const logger = createlogger();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*

How to handle this scenario:

When I ran the server from another IP address (had moved my computer),  the IP address was not whitelisted
on Atlas so I the createAdmin Function can not run - crashes server.

What do I want to do here:

- Do I even want to be able to create an admin from an IP I have not whitelisted?
- I can easily manually whitelist the IP on Atlas
- Should this createAdmin be in a try catch

Why do I even automatically create an admin user.

I do it because if I run the tests the DB is dropped but I always want an admin user as a constant.

*/

async function setupServer() {
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
  
  // Initialise DB
  db.init("mongo");

  // Set Routes
  server.route(webRoutes);
  server.route(apiRoutes);
  server.route(adminRoutes);
  
  process.on("unhandledRejection", (err) => {
    logger.error(err.message);
    process.exit(1);
  });
  return server
}

export async function start() {
  const server = await setupServer()
  await server.start();
  logger.info(`Server running on <${server.info.uri}>`);
  logger.info(`Server started: ${new Date()}`);
  return server;
}
