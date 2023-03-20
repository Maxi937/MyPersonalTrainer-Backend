import Boom from "@hapi/boom";
import { validationError, createlogger } from "../../config/logger.js";
import { UserSpec, IdSpec, UserArray } from "../models/validation/joi-schemas.js";
import { db } from "../models/db.js"


const logger = createlogger()


export const userApi = {
    find: {
      auth: false,
      handler: async function (request, h) {
        try {
          const users = await db.User.find();
          return users;
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
      tags: ["api"],
      description: "Get all userApi",
      notes: "Returns details of all userApi",
      response: { schema: UserArray, failAction: validationError },
    },

    findOne: {
      auth: false,
      handler: async function (request, h) {
        try {
          const user = await db.User.find({id: request.params.id});
          if (!user) {
            return Boom.notFound("No User with this id");
          }
          return user;
        } catch (err) {
          return Boom.serverUnavailable("No User with this id");
        }
      },
      tags: ["api"],
      description: "Get a specific user",
      notes: "Returns user details",
      validate: { params: { id: IdSpec }, failAction: validationError },
      response: { schema: UserSpec, failAction: validationError },
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