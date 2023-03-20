/* eslint-disable no-restricted-syntax */
import fs from "fs"
import { UserSpec, UserUpdateSpec, PlaceSpec, BeerSpec, BeerUpdateSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import { createlogger } from "../../config/logger.js";
import { db } from "../models/db.js"



const logger = createlogger()

export const adminController = {
  index: {
    handler: async function (request, h) {
      const users = await db.User.find({ role: { $ne: "admin" } }).lean()
      const places = await db.Place.findAll()
      const beers = await db.Beer.findAll()
      const reviews = await db.Review.findAll()

      const metrics = {
        totalUsers: {
          data: users.length,
          header: "Total Users",
          icon: "fa-users"
        },
        totalPlaces: {
          data: places.length,
          header: "Total Places",
          icon: "fa-map-marker"
        },
        totalBeers: {
          data: beers.length,
          header: "Total Beers",
          icon: "fa-beer"
        },
        totalReviews: {
          data: reviews.length,
          header: "Total Reviews",
          icon: "fa-book-open"

        }
      }
      const viewData = {
        metrics
      }
      return h.view("admin/admin-main", viewData);
    },
  },

  user: {
    handler: async function (request, h) {
      const user = await db.User.find({ _id: request.params.id }).lean()
      const reviews = await db.Review.find({ user: request.params.id }).populate("place").lean()
      user.profilepicture.data = user.profilepicture.data.toString("base64")

      const viewData = {
        user
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
    validate: {
      payload: UserUpdateSpec,
      failAction: async function (request, h, error) {
        return h.redirect("admin/users", { title: "User error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = await db.User.find({ id: request.params.id })

      if (request.payload.fname) {
        user.fname = request.payload.fname.toLowerCase()
      }

      if (request.payload.lname) {
        user.fname = request.payload.lname.toLowerCase()
      }

      if (request.payload.email) {
        user.email = request.payload.email.toLowerCase()
      }

      if (request.payload.password) {
        user.fname = request.payload.password
      }

      if (request.payload.profilepicture.bytes > 0) {
        user.profilepicture = {
          data: fs.readFileSync(request.payload.profilepicture.path),
          contentType: request.payload.profilepicture.headers["content-type"]
        }
      }
      await user.save()
      return h.redirect("/profile");
    },
  },

  users: {
    handler: async function (request, h) {
      const users = await db.User.find({ role: { $ne: "admin" } }).lean()
      let usersAddedToday = 0

      for (const user of users) {
        user.createdAt = formatISOToDate(user.createdAt)
        user.updatedAt = formatISOToDate(user.updatedAt)
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
        fname: request.payload.fname,
        lname: request.payload.lname,
        email: request.payload.email,
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
      await db.User.findByIdAndDelete(request.params.id)
      return h.redirect("/admin/users");
    }
  },

  places: {
    handler: async function (request, h) {
      const places = await db.Place.findAll()
      let placesAddedToday = 0

      for (const place of places) {
        place.createdAt = formatISOToDate(place.createdAt)
        place.updatedAt = formatISOToDate(place.updatedAt)
        if (place.createdAt === formatISOToDate(Date.now())) {
          placesAddedToday += 1
        }
      }

      const metrics = {
        totalPlaces: {
          data: places.length,
          header: "Total Places",
          icon: "fa-map-marker"
        },
        placesAddedToday: {
          header: "Places Added Today",
          data: placesAddedToday,
          icon: "fa-plus"
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
      const place = new db.Place(request.payload)
      await place.addPlace()
      return h.redirect("/admin/places");
    },
  },

  deletePlace: {
    handler: async function (request, h) {
      await db.Place.findByIdAndDelete(request.params.id)
      return h.redirect("/admin/places");
    }
  },

  beers: {
    handler: async function (request, h) {
      const beers = await db.Beer.findAll()
      let beersAddedToday = 0

      for (const beer of beers) {
        beer.createdAt = formatISOToDate(beer.createdAt)
        beer.updatedAt = formatISOToDate(beer.updatedAt)
        if (beer.createdAt === formatISOToDate(Date.now())) {
          beersAddedToday += 1
        }
      }

      const metrics = {
        totalBeers: {
          data: beers.length,
          header: "Total Beers",
          icon: "fa-beer"
        },
        beersAddedToday: {
          header: "Beers Added Today",
          data: beersAddedToday,
          icon: "fa-plus-square"
        }
      }

      const viewData = {
        beers,
        metrics
      }
      return h.view("admin/admin-beers", viewData);
    },
  },

  openBeerForm: {
    handler: async function (request, h) {
      return h.view("forms/admin/new-beer");
    },
  },

  createNewBeer: {
    auth: false,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true
    },
    validate: {
      payload: BeerSpec,
      failAction: function (request, h, error) {
        return h.view("forms/admin/new-beer", { title: "Beer error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const newBeer = {
        beerName: request.payload.beerName,
        beerType: request.payload.beerType,
        beerImage: {
          data: fs.readFileSync(request.payload.beerImage.path),
          contentType: request.payload.beerImage.headers["content-type"]
        }
      }
      const beer = await new db.Beer(newBeer)

      if (request.payload.beerAvgPrice) {
        beer.beerAvgPrice = request.payload.beerAvgPrice
      } else {
        beer.beerAvgPrice = 0
      }
      await beer.addBeer()
      return h.redirect("/admin/beers");
    },
  },

  updateBeer: {
    auth: false,
    payload: {
      maxBytes: 209715200,
      output: "file",
      parse: true,
      multipart: true
    },
    validate: {
      payload: BeerUpdateSpec,
      failAction: async function (request, h, error) {
        console.log(request.payload)
        logger.error("Form Submission Error")
        const beer = await db.Beer.findById(request.params.id).lean()
        beer.beerImage.data = beer.beerImage.data.toString("base64")
        return h.view("admin/admin-beer", { beer: beer, title: "Beer error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const beer = await db.Beer.findById(request.params.id)

      if (request.payload.beerName) {
        console.log("updating Name")
        beer.beerName = request.payload.beerName
      }

      if (request.payload.beerAvgPrice) {
        console.log("updating Avg")
        beer.beerType = request.payload.beerAvgPrice
      }

      if (request.payload.beerType.toLowerCase() !== beer.beerType.toLowerCase()) {
        console.log("updating Type")
        beer.beerType = request.payload.beerType
      }

      if (request.payload.beerImage.bytes > 0) {
        console.log("updating Image")
        beer.beerImage = {
          data: fs.readFileSync(request.payload.beerImage.path),
          contentType: request.payload.beerImage.headers["content-type"]
        }
      }

      await beer.save()

      // console.log(beer)
      return h.redirect(`/admin/beers/${request.params.id}`);
    },
  },

  deleteBeer: {
    handler: async function (request, h) {
      await db.Beer.findByIdAndDelete(request.params.id)
      return h.redirect("/admin/beers");
    },
  },

  beer: {
    handler: async function (request, h) {
      console.log(request.params.id)
      const beer = await db.Beer.findById(request.params.id).lean()

      beer.beerImage.data = beer.beerImage.data.toString("base64")

      const viewData = {
        beer
      }
      return h.view("admin/admin-beer", viewData);
    },
  },

  reviews: {
    handler: async function (request, h) {
      const reviews = await db.Review.findAll()
      let reviewsAddedToday = 0

      for (const review of reviews) {
        review.createdAt = formatISOToDate(review.createdAt)
        review.updatedAt = formatISOToDate(review.updatedAt)
        if (review.createdAt === formatISOToDate(Date.now())) {
          reviewsAddedToday += 1
        }
      }

      const metrics = {
        totalReviews: {
          data: reviews.length,
          header: "Total Reviews",
          icon: "fa-book-open"
        },
        reviewsAddedToday: {
          header: "Reviews Added Today",
          data: reviewsAddedToday,
          icon: "fa-plus"
        }
      }

      const viewData = {
        reviews,
        metrics
      }
      return h.view("admin/admin-reviews", viewData);
    },
  },

  deleteReview: {
    handler: async function (request, h) {
      await db.Review.findByIdAndDelete(request.params.id)
      return h.redirect("/admin/reviews");
    },
  },

};