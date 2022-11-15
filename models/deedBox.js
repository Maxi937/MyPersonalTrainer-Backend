const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logger = require("../config/logger");

// TODO: Add Validators for inputs
const deedBoxSchema = new Schema(
  {
    client: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Client",
      required: false
    },
    securities:
      [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Security",
        required: false
      }],
    locations: [
      {
        required:false
      }
    ],
  },
  { timestamps: true }
);

// .statics can be called directly on the DeedBox model
deedBoxSchema.statics.findAll = function () {
  try {
    return this.find({}).populate("securities").lean();
  } catch (err) {
    logger.error(err);
  }
};

deedBoxSchema.statics.findUnassigned = function () {
  try {
    return this.find({}).where({ client: null }).populate("securities").lean();
  } catch (err) {
    logger.error(err);
  }
};

// .methods must be called on a deedBox object
deedBoxSchema.methods.addDeedBox = function () {
  try {
    this.save();
    logger.info("DeedBox added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

// .methods must be called on a deedBox query object
deedBoxSchema.query.byClientId = function (clientId) {
  try{
    return this
    .where("client")
    .equals(clientId)
    .populate("securities")
    .lean()
  }
  catch(err){
    logger.error(err);
  }
}

const DeedBox = mongoose.model("DeedBox", deedBoxSchema);

module.exports = DeedBox;
