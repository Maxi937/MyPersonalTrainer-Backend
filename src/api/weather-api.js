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
        const ApiKey = "50985fceed325b8f869e78d691c82cd8"
        
        const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?lat=${44.34}&lon=${10.99}&appid=${ApiKey}`)
        
        console.log(response);
        return response
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Weather Api",
    notes: "Returns details of Weather",
  },
};
