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

    getProfilePicture: {
      auth: false,
      handler: async function (request, h) {
        try {
          const user = await db.User.findOne({_id: request.params.id})
          const profilepicture = {
            data: await user.profilepicture.data.toString("base64"),
            contentType: await user.profilepicture.contentType
          }
          return JSON.stringify(profilepicture)
        } catch (err) {
          console.log(err)
          return JSON.stringify("");
        }
      },
      tags: ["api"],
      description: "get a profile picture userApi",
      notes: "All userApi removed from Playtime",
  },

    getEsriKey: {
        auth: false,
        handler: async function (request, h) {
          try {
            const key = process.env.Esri_Api_Key
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
};