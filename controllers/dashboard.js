"use strict";

const logger = require("../config/logger");
const accounts = require("./accounts.js");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");
const Client = require('../models/Client')

const dashboard = {
  async index(request, response) {
    logger.info("dashboard rendering");
    
    const currentClient = await Client.findById(request.session.client).lean();
    const deedBoxes = await DeedBox.find().byClientId(currentClient._id);
    const unassignedSecurity = await Security.findUnassignedById(request.session.client);

    console.log(`unassigned: ${unassignedSecurity}`);

    const viewData = {
      title: "Dashboard",
      currentClient,
      deedBoxes,
      unassignedSecurity
    };
    response.render("dashboard", viewData);
  },

  /*addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request)
    console.log(request.body)
    const newStation = {
      id: uuid.v1(),
      userId: loggedInUser.id,
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      readings: [],
    };
    stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

  async addAutoReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const openWeatherReading = await openWeatherApi.getAutoReading(station.latitude, station.longitude)

    try {
      const newReading = {
        id: uuid.v1(),
        date: new Date(),
        code: openWeatherReading.weather[0].id,
        temperature: openWeatherReading.main.temp,
        windSpeed: openWeatherReading.wind.speed,
        pressure: openWeatherReading.main.pressure,
        windDirection: openWeatherReading.wind.deg,
        autoWeatherData: openWeatherReading.weather[0]
      }
      newReading.autoWeatherData.icon = "orange first order",

      console.log("new Reading: ", newReading)
      stationStore.addReading(stationId, newReading);
    } catch (error) {
      console.log("Status Code: ", openWeatherReading.cod)
      console.log("Message: ", openWeatherReading.message)
    } 
    response.redirect("/dashboard")
  }*/
};

module.exports = dashboard;
