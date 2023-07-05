import Mongoose from "mongoose";
import { createlogger } from "../../utility/logger.js";

const logger = createlogger();

const userSchema = new Mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    favourites: [
      {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: "Place",
        required: false,
      },
    ],
    profilepicture: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.addUser = function () {
  try {
    this.save();
    logger.info("User added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

userSchema.methods.addFavourite = function (favourite) {
  try {
    this.favourites.addToSet(favourite);
    this.save();
  } catch (err) {
    logger.error(err);
  }
};

userSchema.methods.deleteFavourite = function (favouriteId) {
  try {
    this.favourites.pull({ _id: favouriteId });
    this.save();
  } catch (err) {
    logger.error(err);
  }
};

userSchema.statics.getAll = function () {
  try {
    return this.find({ role: { $ne: "admin" } }).lean();
  } catch (err) {
    logger.error(err);
    return [];
  }
};

userSchema.statics.deleteAll = async function () {
  try {
    await this.deleteMany({ role: { $ne: "admin" } });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

userSchema.statics.getById = async function (userId) {
  try {
    return await this.findOne({ _id: userId }).lean();
  } catch (err) {
    logger.error(err);
    return None;
  }
};

userSchema.statics.getProfile = async function (userId) {
  try {
    return await this.findOne({ _id: userId }).select(["-password", "-updatedAt", "-__v"]).populate("favourites").lean();
  } catch (err) {
    logger.error(err);
    return None;
  }
};

userSchema.query.getByEmail = function (email) {
  return this.findOne({ email: email }).lean();
};

export const User = Mongoose.model("User", userSchema);
