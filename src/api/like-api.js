import Boom from "@hapi/boom";
import { validationError, createlogger } from "../../config/logger.js";
import { checkTokenExpired, decodeToken, getTokenFromRequest, getUserIdFromRequest } from "./jwt-utils.js";
import { db } from "../models/db.js";

const logger = createlogger();

export const likeApi = {
  get: {
    cors: true,
    auth: false,
    async handler(request, h) {
      try {
        const likes = await db.Like.find({ review: request.params.id });
        if (!likes) {
          return h.response([]);
        }
        return h.response(likes);
      } catch (err) {
        logger.error(err.message)
        return Boom.serverUnavailable("No Place with this latlon");
      }
    },
  },

  create: {
    cors: true,
    auth: false,
    handler: async function (request, h) {
      try {
    
        const user = getUserIdFromRequest(request)
        const duplicate = await db.Like.findOne({ user: user, review: request.payload.review });

        if (duplicate) {
          return [];
        }
        const like = new db.Like({
            user: user,
            review: request.payload.review
        });
        console.log(like)
        await like.save();
        return h.response().code(200);
      } catch (err) {
        return Boom.serverUnavailable("Databse unavailable");
      }
    },
  },
};
