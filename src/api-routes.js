import { userApi } from "./api/user-api.js";

export const apiRoutes = [
  // Users
  { method: "GET", path: "/api/users/esrikey", config: userApi.getEsriKey },
  { method: "GET", path: "/api/users/{id}/getuserprofile", config: userApi.getUserProfile },
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];
