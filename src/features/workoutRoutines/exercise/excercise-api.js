import Boom, { boomify } from "@hapi/boom";
import Joi from "joi";
import { ExerciseSpec } from "./exercise-validation.js";
import logger from "../../../utility/logger.js";
import { db } from "../../../database/db.js";
import { getUserIdFromRequest } from "../../../utility/jwt-utils.js";

const exerciseApi = {
  find: {
    method: "GET",
    path: "/api/exercises",
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        if(!userId) {
          return Boom.unauthorized();
        }

        const exercises = await db.Exercise.getExerciseByUser(userId);

        return h.response({ status: "success", exercises: exercises });
      } catch (err) {
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Returns all Excercises",
    notes: "Returns 'status: success' if the request succeeds, even if there are no excercises",
    // response: { schema: ApiResponseSchema },
  },

  findOne: {
    method: "GET",
    path: "/api/exercises/{id}",
    auth: false,
    handler: async function (request, h) {
      try {
        const exercise = await db.Exercise.find().lean().getById(request.params.id);

        if (!exercise) {
          return Boom.notFound();
        }
        return h.response({ status: "success", exercise: exercise }).code(200);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("No Exercise with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
  },

  create: {
    method: "POST",
    path: "/api/exercises",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        if(!userId) {
          return Boom.unauthorized();
        }

        const data = request.payload
        data.createdBy = userId

        console.log("create", data)

        const exercise = await db.Exercise.create(data);
        return h.response({ status: "success", exercise: exercise });
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create an Exercise",
    notes: "Returns the newly exercise",
    validate: {
      payload: ExerciseSpec,
      failAction(request, h, err) {
        console.log(err.message);
        return Boom.badRequest(err.message);
        // return logger.error("JOI validation failure"); // set up a log level for validation errors
      },
    },
  },

  deleteAll: {
    method: "DELETE",
    path: "/api/exercises",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Exercise.deleteAll();
        return h.response({ status: "success" }).code(204);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all userApi",
    notes: "All users removed from db",
  },

  delete: {
    method: "DELETE",
    path: "/api/exercises/{id}",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Exercise.deleteOne(request.params.id);
        return h.response({ status: "success" }).code(202);
      } catch (err) {
        logger.error(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all userApi",
    notes: "All users removed from db",
  },
};

export default exerciseApi;
