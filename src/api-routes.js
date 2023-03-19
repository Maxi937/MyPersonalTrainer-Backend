import { userApi } from "./api/user-api.js";
import { placeApi } from "./api/place-api.js";

export const apiRoutes = [
    { method: "GET", path: "/api/users/esrikey", config: userApi.getEsriKey },

    { method: "POST", path: "/api/places", config: placeApi.create },
    { method: "DELETE", path: "/api/places", config: placeApi.deleteAll },
    { method: "GET", path: "/api/places", config: placeApi.find },
    { method: "GET", path: "/api/places/lat={lat}lng={lng}", config: placeApi.findbyLatLng },
    { method: "GET", path: "/api/places/lat={lat}lng={lng}/reviews", config: placeApi.getAllReviews },
    { method: "GET", path: "/api/places/{id}", config: placeApi.findOne },
    { method: "DELETE", path: "/api/places/{id}", config: placeApi.deleteOne },
  ];
  