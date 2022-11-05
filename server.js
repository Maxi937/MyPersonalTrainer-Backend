"use strict"

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var exphbs = require("express-handlebars")
var router = require("./router");
var logger = require("./utils/logger")

// set up epress
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// logger pass through
app.use( (req, res, done) => {
  logger.info(`${req.method} "${req.originalUrl}"`);
  done();
});

// router
app.use("/", router)

// view engine setup
app.engine(
  ".hbs",
  exphbs.engine({
    extname:".hbs",
    defaultLayout: "main"
  })
);
app.set("view engine", ".hbs");

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
  res.render("error", { url: req.originalUrl });
  logger.error(`${err.status} ${err.message}`)
});

module.exports = app;
