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
import { validateToken } from "../utility/jwt-utils.js";
import logger from "../utility/logger.js";
import { responseTimes } from "./responseTimes.js";
import { requestInfo } from "./requestInfo.js";
import { db, validateAccount } from "../database/db.js";
import { registerRoutes } from "./registerRoutes.js";
import { boomResponseData } from "./boomResponseData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



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
    path: "../views",
    layoutPath: "../views/layouts",
    partialsPath: "../views/partials",
    layout: true,
    isCached: false,
  });

  // Server Extensions
  responseTimes(server);
  requestInfo(server);
  boomResponseData(server);

  // Set up Cookie auth
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: validateAccount,
  });

  server.auth.strategy("github-oauth", "bell", bellAuthOptions);

  // Set up JWT auth
  server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate: validateToken,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("session");

  // Set Routes
  // This adds the public folder
  const publicFolder = { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } };
  server.route(publicFolder);

  // This adds routes from each feature with a default export
  try {
    server.route(await registerRoutes());
  } catch(err) {
    console.log("Unable to register Routes")
    console.log(err)
    process.exit(1)
  }
 

  process.on("unhandledRejection", (err) => {
    logger.error(err.message);
    process.exit(1);
  });
  return server;
}

export async function start() {
  await db.initialiseDb("mongoDB");
  const server = await setupServer();
  await server.start();
  logger.info(`Server running on <${server.info.uri}>`);
  logger.info(`Server started: ${new Date()}`);
  return server;
}
