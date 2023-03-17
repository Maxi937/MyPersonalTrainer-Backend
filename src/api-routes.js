import { userApi } from "./api/user-api.js";

export const apiRoutes = [
    { method: "GET", path: "/api/users/esrikey", config: userApi.getEsriKey },
  ];
  