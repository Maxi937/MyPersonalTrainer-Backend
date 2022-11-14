"use strict";

const logger = require("../config/logger");
const Client = require("../models/Client");

const accounts = {
  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("forms/login", viewData);
  },

  logout(request, response) {
    response.cookie("client", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("forms/newClient", viewData);
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

  async authenticate(request, response) {
    const client = await Client.find().byEmail(request.body.email);
    const email = await client.email

    console.log(request.body.email)

    console.log(await client.email)
 
    if (client._id) {
      logger.info("login successful");
      response.cookie("client", email);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  async getCurrentClient(request) {
    console.log(request)
    const email = request.cookie.client;
    return await Client.find().byEmail(email);
  },
};

module.exports = accounts;
