import Boom from "@hapi/boom";
import logger from "../../utility/logger.js";
import { db } from "../../database/db.js";

const photoApi = {
  find: {
    method: "GET", 
    path: "/api/photos",
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

  addLocalImage: {
    method: "POST", 
    path: "/api/photos/local",
    auth: false,
    payload: {
      maxBytes: 52428800,
      output: "file",
      parse: true,
      multipart: true,
    },
    handler: async function (request, h) {
      try {
        const file = request.payload.photouploadform
        const response = await db.PhotoStorage.uploadLocalImage(file)

        if(response.success) {
          return h.response(response).code(201);
        }
        return h.response({ success: false}).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns all photos",
  },

  deleteAllImages: {
    method: "DELETE", 
    path: "/api/photos",
    auth: false,
    handler: async function (request, h) {
      try {
        const response = await db.PhotoStorage.emptyBucket();

        if(response.success) {
          return h.response(response).code(201)
        }
        return h.response({ success: false}).code(200)
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "get key",
    notes: "Gives a key",
  }
};

export default photoApi