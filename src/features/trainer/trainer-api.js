import Boom from "@hapi/boom";
import fs from "fs";
import logger from "../../utility/logger.js";
import { encryptPassword, unencryptPassword } from "../../utility/encrypt.js";
import { getUserIdFromRequest, createToken } from "../../utility/jwt-utils.js";
import { db } from "../../database/db.js";

const trainerApi = {
  find: {
    method: "GET",
    path: "/api/trainers",
    auth: false,
    handler: async function (request, h) {
      try {
        const users = await db.Trainer.getAll();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all userApi",
    notes: "Returns details of all userApi",
    // requires response validation,
  },

  findOne: {
    method: "GET",
    path: "/api/trainers/{id}",
    auth: false,
    handler: async function (request, h) {
      try {
        const trainer = await db.Trainer.findOne({ _id: request.params.id }).lean();

        if (!trainer) {
          return Boom.notFound("No User with this id");
        }
        return trainer;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get a specific user",
    notes: "Returns user details",
    // requires request validation,
    // requires response validation,
  },

  create: {
    method: "POST",
    path: "/api/trainers",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        let trainer = request.payload;
        trainer.password = await encryptPassword(trainer.password);
        trainer.role = "trainer";

        if (await db.Trainer.isDuplicateEmail(trainer.email)) {
          return Boom.badRequest("Duplicate email");
        }

        trainer = await db.Trainer.create(trainer);
        return h.response(trainer);
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    // requires validation,
  },

  addClient: {
    method: "POST",
    path: "/api/trainers/clients",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const trainer = await db.Trainer.find().getById(request.payload.trainerId);

        const response = await trainer.addClient(request.payload.clientId);

        if (!trainer) {
          return Boom.badRequest("Trainer does not exist");
        }

        return h.response(response);
      } catch (err) {
        console.log(err)
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    // requires validation,
  },

  getClients: {
    method: "GET",
    path: "/api/trainers/{id}/clients",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const trainer = await db.Trainer.find().lean().getById(request.params.id);
        const response = trainer.clients
        return h.response(response);
      } catch (err) {
        console.log(err)
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    // requires validation,
  },

  deleteAll: {
    method: "DELETE",
    path: "/api/trainers",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Trainer.deleteAll();
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
    path: "/api/trainers/authenticate",
    auth: false,
    cors: true,
    handler: async function (request, h) {
      try {
        const { email, password } = request.payload;
        const trainer = await db.Trainer.find().getByEmail(email);

        if (!trainer) {
          return Boom.unauthorized("User not found");
        }

        if ((await unencryptPassword(password, trainer.password)) === false) {
          logger.error("Login Failed, bad credentials");
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(trainer);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        logger.error(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
};

export default trainerApi;