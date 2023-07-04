import Boom from "@hapi/boom";
import fs from "fs";
import { validationError, createlogger } from "../utility/logger.js";
import { UserSpec, IdSpec, UserArray } from "../models/validation/joi-schemas.js";
import { encryptPassword, unencryptPassword } from "../utility/encrypt.js";
import { getUserIdFromRequest , createToken } from "./jwt-utils.js";

import { db } from "../models/db.js";

const logger = createlogger();

export const userApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const users = await db.User.getAll();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all userApi",
    notes: "Returns details of all userApi",
    response: { schema: UserArray, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: request.params.id }).lean();

        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpec, failAction: validationError },
  },

  getUserProfile: {
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const user = await db.User.findOne({ _id: request.params.id });

        if (!user) {
          return Boom.unauthorized("User not found");
        }

        const userName = `${user.fname} ${user.lname}`;
        const profilepicture = {
          data: await user.profilepicture.data.toString("base64"),
          contentType: await user.profilepicture.contentType,
        };

        const userProfile = {
          userName,
          profilepicture,
        };
        return h.response(userProfile);
      } catch (err) {
        return Boom.serverUnavailable("Database not available");
      }
    },
    tags: ["api"],
    description: "get a profile picture and username",
    notes: "returns profile picture as base64 string",
  },

  create: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const duplicateUser = await db.User.findOne({ email: request.payload.email });

        if (duplicateUser) {
          logger.error(`Duplicate User Email: ${duplicateUser.email}`);
          return Boom.badRequest("Duplicate email");
        }

        const user = await new db.User(request.payload);
        user.password = await encryptPassword(user.password);
        user.role = "user";
        user.profilepicture = {
          data: fs.readFileSync("./public/images/placeholder.png"),
          contentType: "image/png",
        };
        await user.save();
        logger.info("user created");
        return h.response(user);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.User.deleteAll();
        return h.response().code(204);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all userApi",
    notes: "All users removed from db",
  },

  authenticate: {
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        const user = await db.User.find().getByEmail(email);

        if (!user) {
          return Boom.unauthorized("User not found");
        }

        if ((await unencryptPassword(password, user.password)) === false) {
          logger.error("Login Failed, bad credentials");
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        logger.error(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};
