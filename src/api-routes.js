import { userApi } from "./api/user-api.js";
import { photoApi } from "./api/photo-api.js";
import { profileApi } from "./api/profile-api.js";

export const apiRoutes = [
  // Users
  { method: "GET", path: "/api/users/{id}/getuserprofile", config: userApi.getUserProfile },
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

  // Profile
  { method: "GET", path: "/api/profile/photos", config: profileApi.getUserImages },
  { method: "POST", path: "/api/profile/photos", config: profileApi.addUserImage },

  // Photos
  { method: "GET", path: "/api/photos", config: photoApi.find },
  { method: "DELETE", path: "/api/photos", config: photoApi.deleteAllImages },
  { method: "POST", path: "/api/photos/local", config: photoApi.addLocalImage },
];
