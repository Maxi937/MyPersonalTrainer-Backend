import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { validationError, createlogger } from "../../config/logger.js";
import { PlaceSpec, IdSpec, PlaceArray } from "../models/validation/joi-schemas.js";

export const placeApi = {
  findbyLatLng: {
    auth: false,
    async handler(request) {
      try {
        const place = await db.Place.findByLatLng(request.params.lat, request.params.lng);
        if (!place) {
          return Boom.notFound("No Place with this id");
        }
        return JSON.stringify(place);
      } catch (err) {
        return Boom.serverUnavailable("No Place with this latlon");
      }
    },
  },

  getAllReviews: {
    auth: false,
    async handler(request) {
      try {
        const reviews = await db.Review.find({ place: request.id }).populate("user")
        if (!reviews) {
          return JSON.stringify("")
        }
        return JSON.stringify(reviews);
      } catch (err) {
        return Boom.serverUnavailable("No Place with this latlon");
      }
    },
  },

  find: {
    auth: false,
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
    auth: false,
    handler: async function (request, h) {
      try {

        let place = await new db.Place(request.payload);
        await place.save()
        place = await db.Place.findOne({ _id: place._id }).lean()
        if (place) {
          return h.response(place).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Place",
    notes: "Returns the newly created place",
    validate: { payload: PlaceSpec, failAction: validationError },
    response: { schema: PlaceSpec, failAction: validationError },
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


