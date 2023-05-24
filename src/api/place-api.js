import Boom from "@hapi/boom";
import fs from "fs"
import { db } from "../models/db.js";
import { validationError, createlogger } from "../../config/logger.js";
import { PlaceSpec, IdSpec, PlaceArray } from "../models/validation/joi-schemas.js";

const logger = createlogger();

export const placeApi = {
  findbyLatLng: {
    cors: true,
    auth: false,
    async handler(request, h) {
      try {

        const place = await db.Place.findByLatLng(request.params.lat, request.params.lng);
        if (!place) {
          logger.info("No Place with this lat long")
          return Boom.notFound("No Place with this id");
        }

        console.log(place)

        if (place.picture) {
          place.picture = {
            data: await place.picture.data.toString("base64"),
            contentType: await place.picture.contentType,
          };
        }


        return h.response(place);
      } catch (err) {
        logger.error(err.message)
        return Boom.serverUnavailable("No Place with this latlon");
      }
    },
  },

  getPlaceReviews: {
    cors: true,
    auth: false,
    async handler(request, h) {
      try {
        const reviews = await db.Review.find({ place: request.params.id }).populate("place");
        if (!reviews) {
          return h.response([]);
        }
        return h.response(reviews);
      } catch (err) {
        return Boom.serverUnavailable("No Place with this latlon");
      }
    },
  },

  find: {
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const places = await db.Place.find().lean();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all placesApi",
    notes: "Returns details of all placesApi",
    response: { schema: PlaceArray, failAction: validationError },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const place = await db.Place.findOne({ id: request.params.id }).lean();
        if (!place) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific place",
    notes: "Returns place details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlaceSpec, failAction: validationError },
  },

  create: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const place = new db.Place(request.payload);
        console.log(place)
        if (!place) {
          return Boom.badRequest();
        }
        await place.save();
        logger.info("New Place created")
        return h.response(place);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Place",
    notes: "Creates a new place",
    validate: { payload: PlaceSpec, failAction: validationError },
  },

  addPlacePhoto: {
    cors: true,
    auth: false,
    payload: {
      maxBytes: 209715200,
      parse: true,
      multipart: true,
      output: "file",
    },
    handler: async function (request, h) {
      try {
        console.log(request.payload)
        const place = await db.Place.findById(request.params.id);

        if (!place || request.payload.bytes <= 0) {
          return Boom.badRequest("Bad Request");
        }

        place.picture = {
          data: fs.readFileSync(request.payload.path),
          contentType: request.headers["content-type"],
        };

        await place.save();
        return h.response(200);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Place",
    notes: "Creates a new place",
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.Place.deleteMany({});
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all placesApi",
    notes: "All places removed from db",
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const place = await db.Place.findOne({ id: request.params.id });
        if (!place) {
          return Boom.notFound("No Track with this id");
        }
        await db.Place.deleteOne({ _id: review._id });
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Place with this id");
      }
    },
  },
};
