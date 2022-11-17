const { upperCase } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require("../config/logger");

// TODO: Add Validators for inputs
const securitySchema = new Schema({
  client: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Client",
    required: true
  },
  deedBox: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "DeedBox",
    required: false
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: true
  },
  address3: {
    type: String,
    required: true
  },
  eircode: {
    type: String,
    required: true,
    uppercase: true
  },
  county: {
    type: String,
    required: true
  },
}, { timestamps: true })


securitySchema.statics.findAllUnassigned = function () {
  try {
    return this.find({})
    .where({ deedBox: { $exists:false } })
    .populate("client")
    .lean();
  } catch (err) {
    logger.error(err);
  }
};

securitySchema.statics.findUnassignedById = function (clientId) {
  try {
    return this.find({clientId})
    .where({ deedBox: { $exists:false } })
    .populate("client")
    .lean();
  } catch (err) {
    logger.error(err);
  }
};

securitySchema.methods.addSecurity = function () {
  try {
    this.save();
    logger.info("Security added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};



const Security = mongoose.model('Security', securitySchema);

module.exports = Security;
