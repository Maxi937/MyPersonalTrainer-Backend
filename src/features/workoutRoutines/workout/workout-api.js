import Boom, { boomify } from "@hapi/boom";
import Joi from "joi";
import { WorkoutSpec } from "./workout-validation.js";
import logger from "../../../utility/logger.js";
import { db } from "../../../database/db.js";

const workoutApi = {
  find: {
    method: "GET",
    path: "/api/workouts",
    auth: false,
    handler: async function (request, h) {
      try {
        const { query } = request;

        const workouts = await db.Workout.find(query);

        if (workouts.length === 1) {
          const workout = workouts[0];
          return h.response({ status: "success", workout: workout });
        }

        return h.response({ status: "success", workouts: workouts });
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
    path: "/api/workouts/{id}",
    auth: false,
    handler: async function (request, h) {
      try {
        const workout = await db.Exercise.find().lean().getById(request.params.id);

        if (!workout) {
          return Boom.notFound();
        }
        return h.response({ status: "success", workout: workout }).code(200);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
  },

  create: {
    method: "POST",
    path: "/api/workouts",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const workout = await db.Workout.create(request.payload);
        return h.response({ status: "success", workout: workout });
      } catch (err) {
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Create an Exercise",
    notes: "Returns the newly exercise",
    validate: {
      payload: WorkoutSpec,
      failAction(request, h, err) {
        console.log(err.message);
        return Boom.badRequest(err.message);
        // return logger.error("JOI validation failure"); // set up a log level for validation errors
      },
    },
  },

  deleteAll: {
    method: "DELETE",
    path: "/api/workouts",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Workout.deleteAll();
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
    path: "/api/workouts/{id}",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Workout.deleteOne(request.params.id);
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

export default workoutApi;
