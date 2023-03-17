// import { User } from "../models/mongo/User.js";
import { UserSpec, PlaceSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import createlogger from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const adminController = {
  index: {
    handler: async function (request, h) {
      return h.view("admin/admin-main");
    },
  },

  users: {
    handler: async function (request, h) {
      const users = await db.User.findAll()
      let usersAddedToday = 0
      
      for (const user of users) {
        user.createdAt = formatISOToDate(user.createdAt)
        user.updatedAt = formatISOToDate(user.updatedAt)
        if (user.createdAt == formatISOToDate(Date.now())) {
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
      const user = new db.User(request.payload)
      user.addUser()
      return h.redirect("/admin/users");
    },
  },

  places: {
    handler: async function (request, h) {
      const places = await db.Place.findAll()
      let placesAddedToday = 0

      for (const place of places) {
        place.createdAt = formatISOToDate(place.createdAt)
        place.updatedAt = formatISOToDate(place.updatedAt)
        if (place.createdAt == formatISOToDate(Date.now())) {
          placesAddedToday += 1
        }
      }

      const metrics = {
        totalPlaces: {
          data: places.length,
          header: "Total Places",
          icon: "fa-users"
        },
        placesAddedToday: {
          header: "Places Added Today",
          data: placesAddedToday,
          icon: "fa-user-plus"
        }
      }

      const viewData = {
        places,
        metrics
      }
      return h.view("admin/admin-places", viewData);
    },
  },

  openPlaceForm: {
    handler: async function (request, h) {
      return h.view("forms/admin/new-place");
    },
  },

  createNewPlace: {
    auth: false,
    validate: {
      payload: PlaceSpec,
      failAction: function (request, h, error) {
        console.log(request.payload)
        logger.error("Form Submission Error")
        return h.view("forms/admin/new-place", { title: "Place error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const data = {
        placeName: request.payload.placeName,
        address: {
          address1: request.payload.address1,
          address2: request.payload.address2,
          address3: request.payload.address3,
          county: request.payload.county,
        }
      }

      console.log(data)
      const place = new db.Place(data)
      await place.addPlace()
      return h.redirect("/admin/places");
    },
  },
};