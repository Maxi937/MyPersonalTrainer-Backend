"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js")

const about = {
  index(request, response) {
    logger.info("about rendering");

    const loggedInUser = accounts.getCurrentUser(request)

    const viewData = {
      title: "About",
      loggedInUser: loggedInUser
    };
    response.render("about", viewData);
  },
};

module.exports = about;
