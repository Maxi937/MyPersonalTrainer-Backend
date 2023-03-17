import { UserSpec, UserCredentialsSpec } from "../models/validation/joi-schemas.js";
import { db } from "../models/db.js";
import createlogger from "../../config/logger.js";
import { getLocationToAddress, GooglegetLocationToAddress } from "../utility/reverse-geocode-api.js";

const logger = createlogger()

export const accountsController = {
  index: {
    auth: false,
    handler: async function (request, h) {
    console.log(request)
      return h.view("user/user-main", { title: "Welcome to Pint Accountant" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Playlist" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("user/user-login", { title: "Login to Playlist" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("user/user-login", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.User.find().getByEmail(email);

      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      logger.info("login success")
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.User.getById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};
