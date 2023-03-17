import Boom from "@hapi/boom";
import createlogger from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()


export const userApi = {
    find: {
        auth: false,
        handler:async function (request, h) {
            try {
                const users = await db.User.find()
                console.log(users)
            } 
            catch (err){
                logger.error(err)
            }
        }
    },

    getEsriKey: {
        auth: false,
        handler: async function (request, h) {
          try {
            const key = process.env.Esri_Api_Key
            console.log("returning key")
            return JSON.stringify(key)
          } catch (err) {
            console.log(err)
            return "";
          }
        },
        tags: ["api"],
        description: "Delete all userApi",
        notes: "All userApi removed from Playtime",
    }
}