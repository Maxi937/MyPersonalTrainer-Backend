import Boom from "@hapi/boom";
import fs from "fs";
import axios from "axios";
import { validationError, createlogger } from "../../config/logger.js";

const logger = createlogger();

export const weatherApi = {
  get: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const lat = parseFloat(request.params.lat)
        const lon = parseFloat(request.params.lng)
        const ApiKey = process.env.APP_ID
        
        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`)
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`)
        
        const reading = response.data

        const weather = {
          wind: reading.wind,
          weather: reading.weather[0].main,
          weatherdescription: reading.weather[0].description,
          temperature: reading.main.temp,
          icon: `https://openweathermap.org/img/wn/${reading.weather[0].icon}@2x.png`,
        }
        return weather
      } catch (err) {
        console.log(err.message)
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Weather Api",
    notes: "Returns details of Weather",
  },


};
