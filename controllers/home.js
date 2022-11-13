"use strict";
const logger = require("../config/logger");
const userStore = require("../models/user-Store");
const User = require("../models/User");

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

  addUserTest(req, res) {
    const User = new User({
      fName: "Max",
      lName: "Hornby",
      organisation: "KPMG",
      email: "mhornby123@gmail.com",
      password: "secret",
    })

    User.save()
      .then((result) => {
        logger.info('User added Successfully');
        res.redirect("/index")
      })
      .catch((err) => {
        logger.error(err);
      });
  }
};

module.exports = home;
