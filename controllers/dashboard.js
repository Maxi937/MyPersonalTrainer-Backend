"use strict";

const logger = require("../config/logger");
const uuid = require("uuid");
const accounts = require("./accounts.js");
const deedBoxStore = require("../models/deedBox-Store");
const securityStore = require("../models/security-Store");
const deedStore = require("../models/deedBox-Store");

const dashboard = {
  index(request, response) {
    logger.info("dashboard rendering");

    deedStore.getAllDeedBoxes().then((result) => {
      logger.info("All DeedBoxes Called");
      const deedBoxes = result;

      const viewData = {
        title: "Dashboard",
        deedBoxes: deedBoxes,
      };
      response.render("dashboard", viewData);
    });
  },

  addDeedBoxTest(request, response) {
    const security = {
      address1: "tramore",
      address2: "pebble walk",
      address3: "pebble beach",
      eircode: "X98T833",
      county: "Waterford",
    };

    const location = {
      name: "Belgard Solcitors",
      address1: "Block D",
      address2: "Cookstown Court",
      address3: "Belgard Road",
      eircode: "X98Z673",
      county: "Dublin",
      date: "2021-02-25T07:20:42.138Z",
    };
    deedBoxStore.addDeedBoxTest(security, location);
  },

  addSecurityTest(request, response) {
    const security = {
      address1: "tramore",
      address2: "pebble walk",
      address3: "pebble beach",
      eircode: "X98T833",
      county: "Waterford",
    };
    securityStore.addSecurityTest(security);
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
