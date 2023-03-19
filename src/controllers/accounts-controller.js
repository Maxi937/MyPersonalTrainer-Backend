import { UserSpec, UserCredentialsSpec } from "../models/validation/joi-schemas.js";
import { db } from "../models/db.js";
import createlogger from "../../config/logger.js";
import * as geocode from "../utility/reverse-geocode-api.js";

const logger = createlogger()

export const accountsController = {
  index: {
    auth: false,
    handler: async function (request, h) {
   
      return h.view("user/user-main", { title: "Welcome to Pint Accountant" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("forms/user/user-signup", { title: "Sign up for Pint Accountant" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        logger.error("form submission error")
        return h.view("forms/user/user-signup", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = new db.User({
        fname: request.payload.fname,
        lname: request.payload.lname,
        email: request.payload.email,
        password: request.payload.password,
        role: "user"
      })
      await user.save();
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
      console.log(email)
      const user = await db.User.find().getByEmail(email);

      if (!user || user.password !== password) {
        return h.redirect("/");
      }

      console.log(user)
      request.cookieAuth.set({ id: user._id });

      if (user.role === "admin") {
        return h.redirect("/admin")
      }

      logger.info("login success")
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
