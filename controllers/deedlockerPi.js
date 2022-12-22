"use strict";

const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");

const deedlockerPi = {

  // Send list of Deedboxes to Pi as JSON
  async getDeedboxes(request, response) {
    try {
      const deedboxes = await DeedBox.findAll().lean();
      response.send(deedboxes);

    } catch (err) {
      response.send(err);
    }
  },

  // Update Location of Deedbox with update received from Pi
 async updateLocation(request, response) {
    logger.info("Location update received from DeedLocker")
    const data = request.body
    const deedBox = await DeedBox.findById(data.boxId)

    deedBox.locations.push(data.location)
    deedBox.save()
    
    response.sendStatus(200);
  },

  async assignRfid(request, response) {
    logger.info("Request to assign Rfid to box")
    console.log(data.boxId)
    response.sendStatus(200);
  }
};

module.exports = deedlockerPi;
