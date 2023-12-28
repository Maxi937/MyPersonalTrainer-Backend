import Boom, { boomify } from "@hapi/boom";
import Joi from "joi";
import { WorkoutSpec } from "./workout-validation.js";
import logger from "../../../utility/logger.js";
import { db } from "../../../database/db.js";
import { getUserIdFromRequest } from "../../../utility/jwt-utils.js";
import { formatStringToISO } from "../../../utility/formatutils.js";

const workoutApi = {
  find: {
    method: "GET",
    path: "/api/workouts",
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        const workouts = await db.Workout.getWorkoutsByUser(userId);

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
        const workout = await db.Workout.find().lean().getById(request.params.id);

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

  update: {
    method: "POST",
    path: "/api/workouts/{id}",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
          return Boom.unauthorized();
        }

        const workout = await db.Workout.findOne({ _id: request.params.id, createdBy: userId }).populate("exercises").lean();
        const newExercises = request.payload.exercises;
        const admin = await this.User.findOne({ role: adminDetails.role })

        newExercises.forEach(async (e) => {
          const exercise = await db.Exercise.create({ bodyPart: e.bodyPart, description: e.description, name: e.name,  sets: e.sets, createdBy: admin._id });
          workout.exercises.pop()
          workout.exercises.push(exercise._id)
        })

        workout.save()

        return h.response({ status: "success", workout: workout });
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Add History",
    notes: "Returns the newly created user",
    // validate: {
    //   payload: WorkoutSpec,
    //   failAction(request, h, err) {
    //     console.log("JOI hhhhhh:", err.message);
    //     return Boom.badRequest(err.message);
    //     // return logger.error("JOI validation failure"); // set up a log level for validation errors
    //   },
    // },
  },

  createHistory: {
    method: "POST",
    path: "/api/workouts/history/{id}",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        request.payload.date = new Date(); // workaround for parsing java date string for mongoose
        const userId = getUserIdFromRequest(request);

        if (!userId) {
          return Boom.unauthorized();
        }

        const history = await db.History.create({ exercises: request.payload, createdBy: userId });
        const workout = await db.Workout.findOne({ _id: request.params.id, createdBy: userId });

        workout.history.push(history._id)

        workout.save();

        return h.response({ status: "success", workout: workout });
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Add History",
    notes: "Returns the newly created user",
    // validate: {
    //   payload: WorkoutSpec,
    //   failAction(request, h, err) {
    //     console.log("JOI hhhhhh:", err.message);
    //     return Boom.badRequest(err.message);
    //     // return logger.error("JOI validation failure"); // set up a log level for validation errors
    //   },
    // },
  },

  // Need Service here to lookup the exercises the user already has and to create if not found - at the moment it just creates new exercises each time
  create: {
    method: "POST",
    path: "/api/workouts",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
          return Boom.unauthorized();
        }

        const workout = await db.Workout.create({ name: request.payload.name, exercises: request.payload.exercises, createdBy: userId });
        const dbWorkout = await db.Workout.findOne({ _id: workout._id }).populate("exercises").lean();

        return h.response({ status: "success", workout: dbWorkout });
      } catch (err) {
        return Boom.serverUnavailable(err);
      }
    },
    tags: ["api"],
    description: "Create a Workout",
    notes: "Returns the newly exercise",
    validate: {
      payload: WorkoutSpec,
      failAction(request, h, err) {
        console.log("JOI:", err.message);
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
    method: "POST",
    path: "/api/workouts/delete",
    auth: false,
    handler: async function (request, h) {
      try {
        console.log(request.payload);
        const userId = getUserIdFromRequest(request);
        await db.Workout.findOneAndDelete({ _id: request.payload._id, createdBy: userId });
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
