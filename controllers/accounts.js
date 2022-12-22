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
    request.session.destroy();
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
    // Check if Admin & reroute
    if (request.body.email === process.env.ADMIN_USERNAME) {
      if (request.body.password === process.env.ADMIN_PASSWORD) {
        logger.info("Admin Login successful");
        request.session.admin = true;
        return response.redirect("/admin");
      }
      else {
        return response.redirect("/login");
      }
    }

    // Check if Client exists & password match
    const client = await Client.find().byEmail(request.body.email);

    if (client == null) {
      response.redirect("/login");
    }
    else {
      if (client.password == request.body.password) {
        logger.info("login successful");
        request.session.client = client._id;
        response.redirect("/dashboard");
      }
      else {
        response.redirect("/login")
      }
    }
  },
};

module.exports = accounts;
