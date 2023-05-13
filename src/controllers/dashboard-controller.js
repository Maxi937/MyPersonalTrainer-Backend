/* eslint-disable no-restricted-syntax */
import { createlogger } from "../../config/logger.js";
import { db } from "../models/db.js"



const logger = createlogger()

export const dashboardController = {
  index: {
    handler: async function (request, h) {
        const reviews = await db.Review.find({})

        const viewData = {
            reviews
        }

      return h.view("user/user-dashboard", viewData);
    },
  },
};