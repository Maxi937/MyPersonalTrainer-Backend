// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import createlogger from "../../../config/logger.js";

const logger = createlogger()

// TODO: Add Validators for inputs

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
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true
    }
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

userSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

userSchema.statics.getById = async function(userId) {
  try {
    return await this.findOne({userId}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

userSchema.query.getByEmail = function(email) {
  return this.findOne({ email: email}).lean()
}

export const User = Mongoose.model("User", userSchema);



