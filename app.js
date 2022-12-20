"use strict";

const dotenv = require("dotenv");
const createError = require("http-errors");
const mongoose = require("mongoose");
const session = require("express-session");
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const router = require("./router");
const logger = require("./config/logger");
const connectDB = require("./config/db");
const MongoStore = require("connect-mongo");
const responseTime = require("response-time");

// Load Config
if (process.env.NODE_ENV === "development"){
  dotenv.config({ path: "./config/config.env" });
}
else {
  dotenv.config({ path: "config.env" })
}

// Express
var app = express();

// Body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express Static Folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB
connectDB();

// Log Server requests and Time taken
if (process.env.NODE_ENV === "development") {
  app.use(
    responseTime(function (req, res, time) {
      logger.info(`${req.method} "${req.url}" - ${time.toFixed(2)}ms`);
    })
  );
}

// Handlebars Helpers
const { formatDate } = require("./config/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatDate,
    }
  })
);
app.set("view engine", ".hbs");

// Sessions
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

// Error handler - Works by Creating an error on every request, router will fulfill any valid routes - otherwise request will carry err(404) through to the error handler
app.use(function (req, res, next) {
  createError(404);
  next();
});

// Router
app.use("/", router);

// Error handler
app.use(function (err, req, res, next) {
  //set status as the error status - default to 404
  res.status(err.status || 404);
  logger.error(res.statusCode);

  switch (res.statusCode) {
    case 404:
      if (process.env.NODE_ENV === "development") {
        res.render("errors/404", { url: req.originalUrl, err: err.message });
      } else {
        res.render("errors/404", { url: req.originalUrl });
      }
      break;
    case 500:
      if (process.env.NODE_ENV === "development") {
        res.render("errors/500", { url: req.originalUrl, err: err });
      } else {
        res.render("errors/500", { url: req.originalUrl, err: err });
      }
      break;
    default:
      if (process.env.NODE_ENV === "development") {
        logger.error(res.statusCode);
      }
      break;
  }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  logger.info(`Server Running in ${app.get("env")} mode on port ${PORT}`)
);

module.exports = app;
