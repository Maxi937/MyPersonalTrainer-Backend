"use strict";
const logger = require("../config/logger");

const home = {
  index(req, res) {
    const viewData = {
      title: "Index",
    };

    logger.info("Rendering Index");

    res.render("index", viewData);
  },

  // Example of throwing error with 500 as status
  error500(req, res) {
    const viewData = {
      title: "Index",
    };

    logger.info("Rendering Error 500");

    const err = new Error("There has been an Error"); // error message
    err.status = 500; // you can custom insert your error code
    err.name = "Server Test Error 500"; // you can custom insert your error name
    throw err;
  },
};

module.exports = home;
