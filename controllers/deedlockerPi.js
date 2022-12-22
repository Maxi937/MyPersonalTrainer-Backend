"use strict";

const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");

const deedlockerPi = {
  
  async getDeedboxes(request, response) {
    try {
      const deedboxes = await DeedBox.findAll();

      const responseData = {
        deedboxes,
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
