import Mongoose from "mongoose";
import { createlogger } from "../../utility/logger.js";

const logger = createlogger();

export const userSchema = new Mongoose.Schema(
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
    profilepicture: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.addUser = async function (user) {
  try {
    user.role = "user"
    const newuser = new this(user)
    await newuser.save();
    logger.info("User added Successfully");
    return newuser
  } catch (err) {
    logger.error(err);
    return {}
  }
};

userSchema.statics.isDuplicateEmail = async function (email) {
  const duplicate = await this.findOne({ email: email });
  if (duplicate) {
    return true;
  }
  return false;
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


userSchema.statics.getProfile = async function (userId) {
  try {
    return await this.findOne({ _id: userId }).select(["-password", "-updatedAt", "-__v"]).lean();
  } catch (err) {
    logger.error(err);
    return None;
  }
};

userSchema.query.getByEmail = function (email) {
  return this.findOne({ email: email }).lean();
};

userSchema.query.getById = async function (userId) {
  try {
    return await this.findOne({ _id: userId });
  } catch (err) {
    logger.error(err);
    return None;
  }
};

export const User = Mongoose.model("User", userSchema);
