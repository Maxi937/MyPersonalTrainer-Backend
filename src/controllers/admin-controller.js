/* eslint-disable no-restricted-syntax */
import fs from "fs"
import { UserSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import { createlogger } from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const adminController = {
  index: {
    handler: async function (request, h) {
      const users = await db.User.find({ role: { $ne: "admin" } }).lean()

      const metrics = {
        totalUsers: {
          data: users.length,
          header: "Total Users",
          icon: "fa-users"
        },
      }
      const viewData = {
        metrics
      }
      return h.view("admin/admin-main", viewData);
    },
  },

  user: {
    handler: async function (request, h) {
      const user = await db.User.findOne({ _id: request.params.id }).lean()
      const reviews = await db.Review.find({ user: request.params.id }).populate("place").lean()
      user.profilepicture.data = user.profilepicture.data.toString("base64")

      const viewData = {
        user,
        reviews
      }
      return h.view("admin/admin-user", viewData);
    },
  },

  updateUser: {
    auth: false,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true
    },
    handler: async function (request, h) {
      const user = await db.User.findOne({ _id: request.params.id })

      if (request.payload.fname) {
        user.fname = request.payload.fname.toLowerCase()
      }

      if (request.payload.lname) {
        user.lname = request.payload.lname.toLowerCase()
      }

      if (request.payload.email) {
        user.email = request.payload.email.toLowerCase()
      }

      if (request.payload.password) {
        user.password = request.payload.password
      }

      if (request.payload.profilepicture.bytes > 0) {
        user.profilepicture = {
          data: fs.readFileSync(request.payload.profilepicture.path),
          contentType: request.payload.profilepicture.headers["content-type"]
        }
      }
      await user.save()
      return h.redirect("/admin/users");
    },
  },

  users: {
    handler: async function (request, h) {
      const users = await db.User.find({ role: { $ne: "admin" } }).lean()
      let usersAddedToday = 0

      for (const user of users) {
        user.createdAt = formatISOToDate(user.createdAt)
        user.updatedAt = formatISOToDate(user.updatedAt)
        delete user.password
        if (user.createdAt === formatISOToDate(Date.now())) {
          usersAddedToday += 1
        }
      }

      const metrics = {
        totalUsers: {
          data: users.length,
          header: "Total Users",
          icon: "fa-users"
        },
        usersAddedToday: {
          header: "Users Added Today",
          data: usersAddedToday,
          icon: "fa-user-plus"
        }
      }

      const viewData = {
        users,
        metrics
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
      const user = new db.User({
        fname: request.payload.fname.toLowerCase(),
        lname: request.payload.lname.toLowerCase(),
        email: request.payload.email.toLowerCase(),
        password: request.payload.password,
        profilepicture: {
          data: fs.readFileSync("./public/images/placeholder.png"),
          contentType: "image/png"
        },
        role: "user"
      })
      user.addUser()
      return h.redirect("/admin/users");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      await db.User.deleteOne({_id: request.params.id})
      await db.Review.deleteMany({user: request.params.id})
      return h.redirect("/admin/users");
    }
  },
};