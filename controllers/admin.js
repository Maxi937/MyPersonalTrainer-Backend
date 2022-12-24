"use strict";
const logger = require("../config/logger");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require("../models/Client");


const admin = {
  async index(req, res) {
    const unassignedDeedBoxes = await DeedBox.findUnassigned();
    const unassignedSecurity = await Security.findAllUnassigned();

    console.log(unassignedDeedBoxes)

    const viewData = {
      unassignedDeedBoxes,
      unassignedSecurity,
      title: "Admin",
    };

    logger.info("Rendering Admin Dashboard");
    res.render("admin/admin-dashboard", viewData);
  },

  async adminClients(req, res) {
    const clientInfo = await Client.findAll();

    for (const client of clientInfo) {
      const deedBoxes = await DeedBox.find().byClientId(client._id);
      client.deedBoxCount = deedBoxes.length;
    }

    const viewData = {
      clientInfo,
      title: "Admin",
    };
    logger.info("Rendering Admin-Clients");
    res.render("admin/admin-clients", viewData);
  },

  async client(req, res) {
    const clientId = req.params.id
    const client = await Client.findById(clientId).lean();
    const deedBoxes = await DeedBox.find().byClientId(clientId);

    const viewData = {
      client,
      deedBoxes,
      title: "Admin",
    };
    logger.info("Rendering Admin Client");
    res.render("admin/client", viewData);
  },

  newDeedBox(req, res) {
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

  async addDeedBox(req, res) {
    const deedboxLocation = {
      'addressline1' : 'DeedBox HQ',
      'addressline2' : 'Dublin',
      'eircode' : 'X78 8899',
      'county' : 'Ireland',
    }

    try {
      const deedBox = new DeedBox({
        _id: req.session.deedBox._id
      })
      deedBox.locations.push(deedboxLocation)
      console.log(deedBox)
      deedBox.save()
      delete req.session.deedBox
    }
    catch (err) {
      logger.info(err)
    }
    res.redirect("/admin")
  },

  async assignDeedBox(req, res) {
    const security = await Security.findById(req.params.securityId)
    const unassignedDeedBox = await DeedBox.findOneUnassigned()

    security.deedBox = unassignedDeedBox._id
    unassignedDeedBox.securities = security
    unassignedDeedBox.client = security.client

    security.save();
    unassignedDeedBox.save();

    console.log(security)
    console.log(unassignedDeedBox)
    res.redirect("/admin")
  }
};

module.exports = admin;