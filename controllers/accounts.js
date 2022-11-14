"use strict";

const logger = require("../config/logger");
const User = require("../models/User");

const accounts = {
  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("forms/login", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("forms/newUser", viewData);
  },

  register(request, response) {
    const user = new User({
      fName: request.body.fName,
      lName: request.body.lName,
      organisation: request.body.organisation,
      email: request.body.email,
      password: request.body.password,
    });
    user.addUser();
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = User.find().byEmail(request.body.email);
    if (user) {
      logger.info("login successful")
      response.cookie("user", user.email);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

//  getCurrentClient(request) {
//    const userEmail = request.cookies.deedBox;
////    return clientStore.getClientByEmail(userEmail);
//  },
};

module.exports = accounts;
