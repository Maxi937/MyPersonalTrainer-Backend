"use strict";
const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");


const admin = {
  async index(req, res) {

    const clientInfo = await Client.findAll();
    const unassignedDeedBoxes = await DeedBox.findUnassigned();
    const allDeedBoxes = await DeedBox.find();

    console.log(allDeedBoxes)
    console.log(unassignedDeedBoxes)

    for (const client of clientInfo) {
      const deedBoxes = await DeedBox.find().byClientId(client._id);
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
      title: "Admin",
    };
    logger.info("Rendering Admin Client");
    res.render("admin/client", viewData);
  },

  newDeedBox(req, res){
    const deedBox = new DeedBox;
    req.session.deedBox = deedBox;
    logger.info(deedBox._id.toString())
    const viewData = {
      deedBox: deedBox,
      deedBoxId: deedBox.id.toString(),
      title: "Admin",
    };
    res.render("admin/forms/newDeedBox", viewData)
  },

  async addDeedBox(req, res){
    const deedBox = req.session.deedBox;
 
    logger.info(`Added: ${deedBox._id.toString()}`)
    try {
      deedBox.addDeedBox()
      delete req.session.deedBox
    }
    catch (err) {
      logger.info(err)
    }
    res.redirect("/admin")
  }



};

module.exports = admin;