"use strict"

require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const exphbs = require("express-handlebars");
const router = require("./router");
const logger = require("./utils/logger");


// set up epress
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// logger pass through
app.use( (req, res, done) => {
  console.log(req)
  logger.info(`${req.method} "${req.originalUrl}"`);
  done();
});

// view engine setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname:".hbs",
    defaultLayout: "main"
  })
);
app.set("view engine", ".hbs");

// router
app.use("/", router)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("partials/error", { url: req.originalUrl, err: err.message } );
  logger.error(`${err.status} ${err.message}`)
});

module.exports = app;
