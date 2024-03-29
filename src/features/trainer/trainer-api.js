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
        const { query } = request;
        const trainers = await db.Trainer.find(query);

        if (trainers.length === 1) {
          const trainer = trainers[0];
          return h.response({ status: "success", trainer: trainer });
        }

        return h.response({ status: "success", trainers: trainers });
      } catch (err) {
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Get all Trainers",
    notes: "Returns details of all Trainers",
    // requires response validation,
  },

  findOne: {
    method: "GET",
    path: "/api/trainers/{id}",
    auth: false,
    handler: async function (request, h) {
      try {
        const trainer = await db.Trainer.find().lean().getById(request.params.id);

        if (!trainer) {
          return Boom.notFound();
        }
        return trainer;
      } catch (err) {
        return Boom.serverUnavailable();
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
          return Boom.badRequest();
        }

        trainer = await db.Trainer.create(trainer);
        return h.response({ status: "success", trainer: trainer });
      } catch (err) {
        logger.error(err.message);
        return Boom.serverUnavailable();
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
        const client = await db.User.find().getById(request.payload.clientId);

        if (!trainer || !client) {
          return Boom.badRequest("Resource does not exist");
          // return h.response({ status: "fail", message: "unkown resource"})
        }

        await trainer.addClient(client._id);

        return h.response({ status: "success", trainer: trainer });
      } catch (err) {
        console.log(err);
        logger.error(err.message);
        return Boom.serverUnavailable();
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Returns the newly created user",
    // requires validation,
  },

  deleteClient: {
    method: "DELETE",
    path: "/api/trainers/{trainerId}/clients/{clientId}",
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
        const trainer = await db.Trainer.find().getById(request.params.trainerId);

        if (!trainer) {
          return Boom.badRequest("Trainer does not exist");
        }
        await trainer.deleteClient(request.params.clientId);

        return h.response({ status: "success", trainer: trainer });
      } catch (err) {
        console.log(err.message);
        logger.error(err.message);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Remove a Client from a Trainer",
    notes: "Returns the Trainers Clients",
    // requires validation,
  },

  delete: {
    method: "DELETE",
    path: "/api/trainers/{id}",
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.Trainer.findOneAndDelete({ _id: request.params.id });
        return h.response({ status: "success" }).code(202);
      } catch (err) {
        logger.error(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete a Trainer",
    notes: "Trainer removed from db",
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
