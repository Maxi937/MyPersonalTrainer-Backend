import fs from "fs";
import { UserSpec, UserCredentialsSpec } from "../models/validation/joi-schemas.js";
import { db } from "../models/db.js";
import { createlogger } from "../utility/logger.js";
import { encryptPassword, unencryptPassword } from "../utility/encrypt.js";

const logger = createlogger();

export const accountsController = {
  index: {
    auth: false,
    handler: async function (request, h) {
      return h.view("admin/admin-login", { title: "Welcome to My Personal Trainer" });
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
        return h.view("forms/user/user-signup", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const errors = {
        userwithemail: {
          message: "There is already a user with the email",
        },
      };

      const user = new db.User({
        fname: request.payload.fname.toLowerCase(),
        lname: request.payload.lname.toLowerCase(),
        email: request.payload.email.toLowerCase(),
        password: await encryptPassword(request.payload.password),
        profilepicture: {
          data: fs.readFileSync("./public/images/placeholder.png"),
          contentType: "image/png",
        },
        role: "user",
      });
      console.log(user);
      const userWithThisEmail = await db.User.find().getByEmail(user.email);
      if (!userWithThisEmail) {
        await user.save();
        return h.redirect("/");
      }
      return h.view("forms/user/user-signup", { title: "Sign up error", errors: errors }).takeover().code(400);
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

      if (!user || (await unencryptPassword(password, user.password)) === false) {
        return h.redirect("/");
      }

      request.cookieAuth.set({ id: user._id });

      if (user.role === "admin") {
        console.log("is admin");
        return h.redirect("/admin");
      }

      logger.info("login success");
      return h.redirect("/dashboard");
    },
  },

  logout: {
    handler: function (request, h, session) {
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
