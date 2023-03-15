// import { User } from "../models/mongo/User.js";
import { UserSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import createlogger from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const adminController = {
  index: {
    handler: async function (request, h) {
      return h.view("admin/adminmain");
    },
  },

  users: {
    handler: async function (request, h) {
      const users = await db.User.findAll()

      for (const user of users) {
        user.createdAt = formatISOToDate(user.createdAt)
        user.updatedAt = formatISOToDate(user.updatedAt)
      }

      const viewData = {
        users,
      }
      return h.view("admin/admin-users", viewData);
    },
  },

  openUserForm: {
    handler: async function (request, h) {

      return h.view("forms/admin/new-user");
    },
  },

  createNewUser: {
    auth: false,
    validate: {
      payload: UserSpec,
      failAction: function (request, h, error) {
        return h.view("forms/admin/new-user", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      console.log(request.payload)
      const user = new User(request.payload)
      user.addUser()

      return h.view("admin/adminmain");
    },
  }
};