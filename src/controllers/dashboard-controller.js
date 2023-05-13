/* eslint-disable no-restricted-syntax */
import fs from "fs"
import { UserSpec, UserUpdateSpec, PlaceSpec, BeerSpec, BeerUpdateSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import { createlogger } from "../../config/logger.js";
import { db } from "../models/db.js"



const logger = createlogger()

export const dashboardController = {
  index: {
    handler: async function (request, h) {

      return h.view("user/user-dashboard");
    },
  },
};