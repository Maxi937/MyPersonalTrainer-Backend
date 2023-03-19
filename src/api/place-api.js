import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const placeApi = {
    find: {
      auth: false,
      handler: async function (request, h) {
        try {
          const places = await db.Place.findAll();
          return places;
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },
  
    findOne: {
      auth: false,
      async handler(request) {
        try {
          const place = await db.Place.byPlaceId(request.params.id);
          if (!place) {
            return Boom.notFound("No Place with this id");
          }
          return place;
        } catch (err) {
          return Boom.serverUnavailable("No Place with this id");
        }
      },
    },

    findbyLatLng: {
        auth: false,
        async handler(request) {
          console.log(request.params.lat)
          try {
            const place = await db.Place.findByLatLng(request.params.lat,request.params.lng);
            if (!place) {
              return Boom.notFound("No Place with this id");
            }
            return JSON.stringify(place);
          } catch (err) {
            return Boom.serverUnavailable("No Place with this latlon");
          }
        },
      },

      getAllReviews: {
        auth: false,
        async handler(request) {
          try {
            const reviews = await db.Review.find(request.id).populate("user")
            console.log(reviews)
            if(!reviews) {
              return JSON.stringify("")
            }
            return JSON.stringify(reviews);
          } catch (err) {
            return Boom.serverUnavailable("No Place with this latlon");
          }
        },
      },
  
    create: {
      auth: false,
      handler: async function (request, h) {
        try {
          const place = new db.Place(request.payload);
          await place.addPlace();
          if (place) {
            return h.response(place).code(201);
          }
          return Boom.badImplementation("error creating place");
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },
  
    deleteOne: {
      auth: false,
      handler: async function (request, h) {
        try {
          const playlist = await db.playlistStore.getPlaylistById(request.params.id);
          if (!playlist) {
            return Boom.notFound("No Playlist with this id");
          }
          await db.playlistStore.deletePlaylistById(playlist._id);
          return h.response().code(204);
        } catch (err) {
          return Boom.serverUnavailable("No Playlist with this id");
        }
      },
    },
  
    deleteAll: {
      auth: false,
      handler: async function (request, h) {
        try {
          await db.playlistStore.deleteAllPlaylists();
          return h.response().code(204);
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
    },
  };