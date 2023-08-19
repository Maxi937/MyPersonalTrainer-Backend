import fs from "fs";
import { UserSpec, UserCredentialsSpec } from "./user-validation.js";
import { db } from "../../database/db.js";
import logger from "../../utility/logger.js";
import { encryptPassword, unencryptPassword } from "../../utility/encrypt.js";


const accountsController = {
  index: {
    method: "GET",
    path: "/",
    auth: false,
    handler: async function (request, h) {
      return h.view("admin/admin-login", { title: "Welcome to My Personal Trainer" });
    },
  },

  showSignup: {
    method: "GET",
    path: "/signup",
    auth: false,
    handler: function (request, h) {
      return h.view("forms/user/user-signup", { title: "Sign up for Pint Accountant" });
    },
  },

  signup: {
    method: "POST",
    path: "/register",
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
    method: "GET",
    path: "/login",
    auth: false,
    handler: function (request, h) {
      return h.view("user/user-login", { title: "Login to Playlist" });
    },
  },

  login: {
    method: "POST",
    path: "/authenticate",
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
        return h.redirect("/admin");
      }

      logger.info("login success");
      return h.redirect("/dashboard");
    },
  },

  logout: {
    method: "GET",
    path: "/logout",
    handler: function (request, h, session) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
};

export default accountsController
