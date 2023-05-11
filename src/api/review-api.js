import Boom from "@hapi/boom";
import { validationError, createlogger } from "../../config/logger.js";
import { ReviewSpec, ReviewArray } from "../models/validation/joi-schemas.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const reviewApi = {
  get: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const reviews = await db.Review.getAll();
        return h.response(reviews);
      } catch (err) {
        logger.error(err.message)
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all reviewApi",
    notes: "Returns details of all Reviews",
    response: { schema: ReviewArray, failAction: validationError },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const review = await db.Review.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No Review with this id");
        }
        return user;
      } catch (err) {
        logger.error(err.message)
        return Boom.serverUnavailable("No Review with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific review",
    notes: "Returns review details",
    response: { schema: ReviewSpec, failAction: validationError },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        let review = await new db.Review(request.payload);
        await review.save()
        review = await db.Review.findOne({ _id: review._id }).lean()
        if (review) {
          return h.response(review).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a Review",
    notes: "Returns the newly created review",
    validate: { payload: ReviewSpec, failAction: validationError },
    response: { schema: ReviewSpec, failAction: validationError },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      try {
        await db.Review.deleteMany({});
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all reviewApi",
    notes: "All reviews removed from db",
  },

  deleteOne: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const review = await db.Review.findOne({ _id: request.params.id });
        if (!review) {
          return Boom.notFound("No Review with this id");
        }
        await db.Review.deleteOne({ _id: review._id });
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Review with this id");
      }
    },
  },
};