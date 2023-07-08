import Boom from "@hapi/boom";
import fs from "fs";
import { validationError, createlogger } from "../../utility/logger.js";
import { getUserIdFromRequest, createToken } from "../../utility/jwt-utils.js";
import { db } from "../../database/db.js";

const logger = createlogger();

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
    path: "/api/profile/getProfile",
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
        console.log(err);
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all photos",
    notes: "Returns all photos",
  },
};

export default profileApi