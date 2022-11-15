const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../config/logger");

// TODO: Add Validators for inputs
const clientSchema = new Schema(
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
      lowercase: true
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

clientSchema.methods.addUser = function () {
  try {
    this.save();
    logger.info("User added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

clientSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
  }
}

clientSchema.statics.byClientId = function(clientId) {
  try {
    return this.find({clientId}).lean() 
  } catch (err) {
    logger.error(err);
  }
}

clientSchema.query.byEmail = function(email) {
  return this.findOne({ email: new RegExp(email, "i") }).lean()
}

const Client = mongoose.model("Client", clientSchema);


module.exports = Client;
