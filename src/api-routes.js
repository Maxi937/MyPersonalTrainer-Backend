import { userApi } from "./api/user-api.js";
import { placeApi } from "./api/place-api.js";
import { reviewApi } from "./api/review-api.js";

export const apiRoutes = [
  // Users
  { method: "GET", path: "/api/users/esrikey", config: userApi.getEsriKey },
  { method: "GET", path: "/api/users/{id}/profilepicture", config: userApi.getProfilePicture },
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  // Reviews
  { method: "GET", path: "/api/reviews", config: reviewApi.find },
  { method: "POST", path: "/api/reviews", config: reviewApi.create },
  { method: "DELETE", path: "/api/reviews", config: reviewApi.deleteAll },
  { method: "GET", path: "/api/reviews/{id}", config: reviewApi.findOne },
  { method: "DELETE", path: "/api/reviews/{id}", config: reviewApi.deleteOne },

  // Places
  { method: "POST", path: "/api/places", config: placeApi.create },
  { method: "DELETE", path: "/api/places", config: placeApi.deleteAll },
  { method: "GET", path: "/api/places", config: placeApi.find },
  { method: "GET", path: "/api/places/lat={lat}lng={lng}", config: placeApi.findbyLatLng },
  { method: "GET", path: "/api/places/{id}/reviews", config: placeApi.getAllReviews },
  { method: "GET", path: "/api/places/{id}", config: placeApi.findOne },
  { method: "DELETE", path: "/api/places/{id}", config: placeApi.deleteOne },
];
