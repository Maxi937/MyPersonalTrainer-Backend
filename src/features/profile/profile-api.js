import Boom from "@hapi/boom";
import fs from "fs";
import moment from "moment";
import logger from "../../utility/logger.js";
import { getUserIdFromRequest } from "../../utility/jwt-utils.js";
import { db } from "../../database/db.js";
import { formatISOToDate } from "../../utility/formatutils.js";

const profileApi = {
  update: {
    method: "POST",
    path: "/api/profile",
    auth: false,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true,
    },
    handler: async function (request, h) {
      const user = await db.User.findById(request.params.id);

      if (request.payload.fname) {
        user.fname = request.payload.fname.toLowerCase();
      }

      if (request.payload.lname) {
        user.lname = request.payload.lname.toLowerCase();
      }

      if (request.payload.email) {
        user.email = request.payload.email.toLowerCase();
      }

      if (request.payload.password) {
        user.password = request.payload.password;
      }

      if (request.payload.profilepicture.bytes > 0) {
        user.profilepicture = {
          data: fs.readFileSync(request.payload.profilepicture.path),
          contentType: request.payload.profilepicture.headers["content-type"],
        };
      }
      await user.save();
      return h.redirect("/profile");
    },
    tags: ["api"],
    description: "get a profile picture userApi",
    notes: "returns profile picture as base64 string",
  },

  getUserProfile: {
    method: "GET",
    path: "/api/profile",
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);
        const user = await db.User.find().lean().getById(userId);

        if (!user) {
          return Boom.unauthorized();
        }

        const userDetails = {
          fname: user.fname,
          lname: user.lname,
          email: user.email,
        };

        const workouts = await db.Workout.getWorkoutsByUser(userId);
        const exercises = await db.Exercise.getExerciseByUser(userId);
      

        for (let i = 0; i <= workouts.length; i++) {
          try {
            if (workouts[i].hasOwnProperty("history")) {
              if (workouts[i].history.length >= 1) {
                for (let x = 0; x <= workouts[i].history.length; x++) {
                  workouts[i].history[x] = await db.History.findOne({_id: workouts[i].history[x]._id}).populate("exercises").lean();
                  workouts[i].history[x].createdAt = moment(Date(workouts[i].history[x].createdAt)).format("DD-MMM-YY")
                  console.log(workouts[i].history[x]);
                }
              }
            }
          } catch (err) {
            console.log(err);
          }
        }

        const userProfile = {
          userDetails,
          workouts,
          exercises,
        };

        return h.response({ status: "success", profile: userProfile }).code(200);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database not available");
      }
    },
    tags: ["api"],
    description: "get a profile picture and username",
    notes: "returns profile picture as base64 string",
  },

  getUserImages: {
    method: "GET",
    path: "/api/profile/photos",
    auth: { strategy: "jwt" },
    cors: true,
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);
        const images = await db.PhotoStorage.getPhotos(userId);
        return h.response(images);
      } catch (err) {
        return Boom.serverUnavailable("Database not available");
      }
    },
    tags: ["api"],
    description: "get a profile picture and username",
    notes: "returns profile picture as base64 string",
  },

  addUserImage: {
    method: "POST",
    path: "/api/profile/photos",
    auth: false,
    payload: {
      maxBytes: 52428800,
      output: "file",
      parse: true,
      multipart: true,
    },
    handler: async function (request, h) {
      try {
        const userId = getUserIdFromRequest(request);
        const file = request.payload.photouploadform;
        const response = await db.PhotoStorage.uploadUserImage(file, userId);

        if (response.success) {
          return h.response(response).code(201);
        }
        return h.response({ success: false }).code(200);
      } catch (err) {
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns all photos",
  },
};

export default profileApi;
