import Boom, { boomify } from "@hapi/boom";
import Joi from "joi";
import { WorkoutSpec } from "./workout-validation.js";
import logger from "../../../utility/logger.js";
import { db } from "../../../database/db.js";
import { getUserIdFromRequest } from "../../../utility/jwt-utils.js";

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

  createHistory: {
    method: "POST",
    path: "/api/workouts/history",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);

        if(!userId) {
          return Boom.unauthorized();
        }

        const workout = await db.Workout.findOne({ name: request.payload.name, createdBy: userId})
        if(workout.history) {
          workout.history.push(new Date())
        } else {
          workout.history = [ new Date() ]
        }
        
        workout.save()
        console.log("new history ", workout.name)
 
        return h.response({ status: "success", workout: workout });
      } catch (err) {
        console.log(err);
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Add History",
    notes: "Returns the newly created user",
    validate: {
      payload: WorkoutSpec,
      failAction(request, h, err) {
        return Boom.badRequest(err.message);
        // return logger.error("JOI validation failure"); // set up a log level for validation errors
      },
    },
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
        const exercisesToAdd = [];

        if (!userId) {
          return Boom.unauthorized();
        }

        const userExercises = request.payload.exercises
        console.log(userExercises)

        for(let i = 0;i < userExercises.length ; i++) {
          console.log("looking for ",  userExercises[i].name)
          const { _id } = await db.Exercise.findOne({ name: userExercises[i].name, createdBy: userId })
          console.log(_id)
          exercisesToAdd.push(_id)
        }

        const workout = await db.Workout.create({ name: request.payload.name, exercises: exercisesToAdd, createdBy: userId, history: [] });

        return h.response({ status: "success", workout: workout });
      } catch (err) {
        return Boom.serverUnavailable();
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
        console.log(request.payload)

        const userId = getUserIdFromRequest(request);
        await db.Workout.findOneAndDelete({ name: request.payload.name, createdBy: userId })
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
