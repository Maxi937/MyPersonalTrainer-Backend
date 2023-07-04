import Boom from "@hapi/boom";
import { validationError, createlogger } from "../utility/logger.js";
import { db } from "../models/db.js";

const logger = createlogger();

export const photoApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
      try {
        console.log("hello");
        const photos = await db.PhotoStorage.getPhotos();
        console.log(photos);
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns all photos",
  },

  addImage: {
    auth: false,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true,
    },
    handler: async function (request, h) {
      logger.info(request.payload);

      try {
        const file = request.payload;
        //return console.log(file)
        //const photos = await db.PhotoStorage.uploadImage()
        //console.log(photos)
        return h.response({ success: true}).code(201);
      } catch (err) {
        return err;
        //return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns all photos",
  },
};
