"use strict";
const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");


const admin = {
  async index(req, res) {

    const clientInfo = await Client.findAll()

    for (const client of clientInfo) {
      const deedBoxes = await DeedBox.find().byClientId(client._id)
      client.deedBoxCount = deedBoxes.length;
    }
    
    const viewData = {
      clientInfo,
      title: "Admin",
    };

    logger.info("Rendering Admin");
    res.render("admin/admin", viewData);
  },

  async client(req, res) {
    const clientId = req.params.id
    const client = await Client.findById(clientId).lean()
    const deedBoxes = await DeedBox.find().byClientId(clientId)

    console.log(deedBoxes)
    const viewData = {
      client,
      deedBoxes,
      title: "Admin-Client",
    };

    logger.info("Rendering Admin Client");
    res.render("admin/client", viewData);
  },



};

module.exports = admin;