"use strict";

const logger = require("../config/logger");
const uuid = require("uuid");

const accounts = {
  login(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    clientStore.addUser(user);
    //logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const client = clientStore.getClientByEmail(request.body.email);
    if (client) {
      response.cookie("deedBox", client.email);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentClient(request) {
    const userEmail = request.cookies.deedBox;
    return clientStore.getClientByEmail(userEmail);
  }
};

module.exports = accounts;