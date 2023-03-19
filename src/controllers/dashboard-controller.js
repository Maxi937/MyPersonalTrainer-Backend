import fs from "fs"
import { UserSpec, PlaceSpec, BeerSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import createlogger from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const dashboardController = {

  index: {
    handler: async function (request, h) {
      const beers = await db.Beer.findAll()

      for (const beer of beers) {
        beer.beerImage.data = beer.beerImage.data.toString("base64")
      }

      const viewData = {
        beers
      }
      return h.view("user/user-dashboard", viewData);
    },
  },

  review: {
    handler: async function (request, h) {
      console.log(request.payload)


      let place = await db.Place.findByLatLng(request.payload.lat, request.payload.lng)

      if (!place) {
        logger.info("No Place found, creating...")
        place = new db.Place({
          placeName: request.payload.placeName,
          placeAddress: request.payload.placeAddress,
          description: "A Nice Place",
          lat: request.payload.lat,
          lng: request.payload.lng
        })
        place.save()
      }

      console.log(request.auth.credentials)

      const review = new db.Review({
        date: new Date(),
        user: request.auth.credentials._id,
        rating: 5,
        content: request.payload.reviewContent,
        place: place._id
      })

      place.reviews.push(review._id)

      await review.save()
      await place.save()

      return h.redirect("/dashboard");
      }
    }
};