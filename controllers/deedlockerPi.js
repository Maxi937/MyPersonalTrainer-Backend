"use strict";

const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");

const deedlockerPi = {
  hello(request, response) {
    const responseData = {
      message: "Hello here is some data",
      data: "49 is the meaning of life",
    };
    response.status(200).json(responseData);
  },

  async getUsers(request, response) {
    try {
      const users = await Client.findAll();

      const responseData = {
        users,
      };
      response.status(200).json(responseData);
    } catch (err) {
      response.send(err);
    }
  },

 async updateLocation(request, response) {
    logger.info("Location update received from DeedLocker")
    const data = request.body
    const deedBox = await DeedBox.findById(data.boxId)

    deedBox.locations.push(data.location)
    deedBox.save()
    
    response.sendStatus(200);
  }
};

module.exports = deedlockerPi;
