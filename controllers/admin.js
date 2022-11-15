"use strict";
const logger = require("../config/logger");

const admin = {
  index(req, res) {
    const viewData = {
      title: "Admin",
    };

    logger.info("Rendering Admin");

    res.render("admin/admin", viewData);
  },

};

module.exports = admin;