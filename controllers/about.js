"use strict";

const logger = require("../config/logger");
const accounts = require("./accounts.js")

const about = {
  index(request, response) {
    logger.info("Rendering About");
    console.log(request.session)


    const client = false || request.session.client

    console.log(client)

    const viewData = {
      client,
      title: "About",
    };
    response.render("about", viewData);
  },
};

module.exports = about;
