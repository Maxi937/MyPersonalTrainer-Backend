import Boom from "@hapi/boom";
import fs from "fs";
import { validationError, createlogger } from "../../config/logger.js";
import { UserUpdateSpec } from "../models/validation/joi-schemas.js";
import { checkTokenExpired, decodeToken, getTokenFromRequest, getUserIdFromRequest } from "./jwt-utils.js";
import { db } from "../models/db.js";

const logger = createlogger();

export const profileApi = {
  update: {
    cors: true,
    auth: {
      strategy: "jwt",
    },
    validate: {
      payload: UserUpdateSpec,
      failAction: async function (request, error) {
        logger.error("Form Submission Error");
        return Boom.badRequest("Bad Request");
      },
    },
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: getUserIdFromRequest(request) });

        if (request.payload.fname) {
          user.fname = request.payload.fname.toLowerCase();
        }

        if (request.payload.lname) {
          user.lname = request.payload.lname.toLowerCase();
        }

        if (request.payload.email) {
          user.email = request.payload.email.toLowerCase();
        }

        await user.save();
        return h.response(200);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database error");
      }
    },
    tags: ["api"],
    description: "Update User Details",
    notes: "Requires Token",
  },

  checkToken: {
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const token = getTokenFromRequest(request);

        if (!token) {
          return Boom.notFound("No Token in Request");
        }
        const tokenexpired = await checkTokenExpired(token);
        return h.response(tokenexpired).code(201);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database unavailable");
      }
    },
    tags: ["api"],
    description: "check if a token is valid",
    notes: "Requires Token",
  },

  get: {
    auth: {
      strategy: "jwt",
    },
    cors: true,
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: getUserIdFromRequest(request) });
        return h.response(user).code(201);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database unavailable");
      }
    },
    tags: ["api"],
    description: "get a profile",
    notes: "Requires Token",
  },

  updateProfilePicture: {
    auth: {
      strategy: "jwt",
    },
    cors: true,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true,
    },
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: getUserIdFromRequest(request) });

        if (!user || request.payload.bytes <= 0) {
          return Boom.badRequest("Bad Request");
        }

        user.profilepicture = {
          data: fs.readFileSync(request.payload.path),
          contentType: request.headers["content-type"],
        };
        await user.save();
        return h.response(200);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database unavailable");
      }
    },
    tags: ["api"],
    description: "update profile picture",
    notes: "requires token",
  },

  getProfilePicture: {
    auth: {
      strategy: "jwt",
    },
    cors: true,
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: getUserIdFromRequest(request) });

        if (!user) {
          return Boom.unauthorized("No User Found");
        }
        const profilepicture = {
          data: await user.profilepicture.data.toString("base64"),
          contentType: await user.profilepicture.contentType,
        };
        return JSON.stringify(profilepicture);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database unavailable");
      }
    },
    tags: ["api"],
    description: "get a profile picture userApi",
    notes: "returns profile picture as base64 string",
  },

  getProfileReviews: {
    auth: {
      strategy: "jwt",
    },
    cors: true,
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: getUserIdFromRequest(request) });
        const reviews = await db.Review.find({ user: user._id }).populate("place").lean();
        return h.response(reviews);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database unavailable");
      }
    },
    tags: ["api"],
    description: "get a profile picture userApi",
    notes: "returns profile picture as base64 string",
  },
};
