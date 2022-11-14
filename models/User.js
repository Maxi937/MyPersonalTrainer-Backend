const mongoose = require("mongoose");
const logger = require("../config/logger");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    organisation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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

userSchema.statics.findAll = function() {
  try {
    logger.info(this.find({}).lean() )
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
  }
}

userSchema.query.byEmail = function(email) {
  return this.where({ name: new RegExp(email, "i") })
}

const User = mongoose.model("User", userSchema);


module.exports = User;
