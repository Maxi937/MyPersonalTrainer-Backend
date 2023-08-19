import Boom from "@hapi/boom";
import fs from "fs";
import logger from "../../utility/logger.js";
import { UserSpec, IdSpec, UserArray } from "./user-validation.js";
import { encryptPassword, unencryptPassword } from "../../utility/encrypt.js";
import { getUserIdFromRequest, createToken } from "../../utility/jwt-utils.js";
import { db } from "../../database/db.js";

const userApi = {
  find: {
    method: "GET",
    path: "/api/users",
    auth: false,
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
    response: { schema: UserArray },
  },

  findOne: {
    method: "GET",
    path: "/api/users/{id}",
    auth: false,
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
    validate: { params: { id: IdSpec } },
    response: { schema: UserSpec },
  },

  create: {
    method: "POST",
    path: "/api/users",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        let user = request.payload;
        user.password = await encryptPassword(user.password);

        if (await db.User.isDuplicateEmail(user.email)) {
          return Boom.badRequest("Duplicate email");
        }

        user = await db.User.addUser(user);
        return h.response(user);
      } catch (err) {
        console.log(err);
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    validate: {
      payload: UserSpec,
      failAction(request, h, err) {
        return logger.error("JOI validation failure"); // set up a log level for validation errors
      },
    },
  },

  deleteAll: {
    method: "DELETE",
    path: "/api/users",
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
    method: "POST",
    path: "/api/users/authenticate",
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

export default userApi;
