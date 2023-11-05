import Boom, { boomify } from "@hapi/boom";
import Joi from "joi";
import fs from "fs";
import logger from "../../utility/logger.js";
import { UserSpec, ApiResponseSchema } from "./user-validation.js";
import { IdSpec } from "../../database/mongo/mongo-validation.js";
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
        const { query } = request;

        const users = await db.User.find(query);

        return h.response({ status: "success", users: users });
      } catch (err) {
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Returns all Users",
    notes: "Returns 'status: success' if the request succeeds, even if there are no users",
    // response: { schema: ApiResponseSchema },
  },

  findOne: {
    method: "GET",
    path: "/api/users/{id}",
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await db.User.find().lean().getById(request.params.id);

        if (!user) {
          return Boom.notFound();
        }
        return h.response({ status: "success", user: user }).code(200);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    validate: { params: { id: IdSpec } },
    response: { schema: ApiResponseSchema },
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


        return h.response({ status: "success", user: user });
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
        return Boom.badRequest(err.message);
        // return logger.error("JOI validation failure"); // set up a log level for validation errors
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
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all userApi",
    notes: "All users removed from db",
  },

  delete: {
    method: "DELETE",
    path: "/api/users/{id}",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.User.findOneAndDelete({ _id: request.params.id });
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

  authenticate: {
    method: "POST",
    path: "/api/users/authenticate",
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        
        const { email, password } = request.payload;
        const user = await db.User.find().getByEmail(email);

        // TODO: Review decryption need to unencrypt first regardless of whether a user exists - timin attack vector
        if (!user || (await unencryptPassword(password, user.password)) === false) {
          return Boom.badRequest("Resource not available");
        }


        const token = createToken(user);
        return h.response({ status: "success", token: token }).code(201);
      } catch (err) {
        console.log(err);
        logger.error(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};

export default userApi;
