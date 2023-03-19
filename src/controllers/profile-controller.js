import fs from "fs"
import { UserSpec, PlaceSpec, BeerSpec, UserUpdateSpec } from "../models/validation/joi-schemas.js";
import { formatISOToDate } from "../utility/formatutils.js";
import createlogger from "../../config/logger.js";
import { db } from "../models/db.js"

const logger = createlogger()

export const profileController = {

    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            loggedInUser.profilepicture.data = loggedInUser.profilepicture.data.toString("base64")
  
            const reviews = await db.Review.find({user: loggedInUser._id}).populate("place").lean()

            console.log(reviews)
            const viewData = {
                user: loggedInUser,
                reviews
            }

            return h.view("user/user-profile", viewData);
        },
    },

    updateProfile: {
        auth: false,
        payload: {
            maxBytes: 209715200,
            output: "file",
            parse: true,
            multipart: true
        },
        validate: {
            payload: UserUpdateSpec,
            failAction: async function (request, h, error) {
                logger.error("Form Submission Error")
                const loggedInUser = await db.User.findById(request.params.id).lean()
                loggedInUser.profilepicture.data = loggedInUser.profilepicture.data.toString("base64")
                return h.view("user/user-profile", { user: loggedInUser, title: "User error", errors: error.details }).takeover().code(400);
            },
        },
        handler: async function (request, h) {
            const user = await db.User.findById(request.params.id)

            if (request.payload.fname) {
                console.log("updating fname")
                user.fname = request.payload.fname.toLowerCase()
            }

            if (request.payload.lname) {
                console.log("updating fname")
                user.fname = request.payload.lname.toLowerCase()
            }

            if (request.payload.email) {
                console.log("updating email")
                user.email = request.payload.email.toLowerCase()
            }

            if (request.payload.password) {
                console.log("updating password")
                user.fname = request.payload.password
            }

            if (request.payload.profilepicture.bytes > 0) {
                console.log("updating Image")
                user.profilepicture = {
                    data: fs.readFileSync(request.payload.profilepicture.path),
                    contentType: request.payload.profilepicture.headers["content-type"]
                }
            }

            await user.save()
            return h.redirect("/profile");
        },
    },

    deleteReview: {
        handler: async function (request, h) {
          await db.Review.findByIdAndDelete(request.params.id)
          return h.redirect("/profile");
        },
    },

};