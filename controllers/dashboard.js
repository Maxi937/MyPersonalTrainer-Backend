"use strict";

const logger = require("../config/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const DeedBox = require("../models/DeedBox");
const Security = require("../models/Security");

const dashboard = {
  async index(request, response) {
    logger.info("dashboard rendering");
    
    const currentClient = await accounts.getCurrentClient(request);
    const deedBoxes = await DeedBox.find().byClientId(currentClient._id);

    console.log(deedBoxes);

    const viewData = {
      title: "Dashboard",
      deedBoxes: deedBoxes,
    };
    response.render("dashboard", viewData);
  },

  addDeedBox(request, response) {
    const deedBox = new DeedBox({
      client: "6372b88df4ecc61e4b40c2df",
      securities: "6372b99ae69bfe9b7bac06c1",
      locations: {
        date: "2021-02-25T07:20:42.138Z",
        name: "Belgard Solcitors",
        address1: "Block D",
        address2: "Cookstown Court",
        address3: "Belgard Road",
        eircode: "X98Z673",
        county: "Dublin",
      },
    });
    deedBox.addDeedBox();
    response.redirect("/dashboard");
  },

  addSecurity(request, response) {
    const security = new Security({
      address1: "12 Pebble Walk",
      address2: "Pebble Beach",
      address3: "Pickardstown",
      eircode: "XCT6Y767",
      county: "Waterford",
    });
    security.addSecurity();
    response.redirect("/dashboard");
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
