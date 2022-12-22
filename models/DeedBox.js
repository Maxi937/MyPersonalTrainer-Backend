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
        type: Object,
        required: false
      }
    ],
    rfid:
    {
      type: String,
      required: false
    }
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
    return this.find({}).populate("securities").where({ client: null }).lean();
  } catch (err) {
    logger.error(err);
  }
};

deedBoxSchema.statics.findOneUnassigned = function () {
  try {
    return this.find().where({ client: null }).populate("securities").findOne();
  } catch (err) {
    logger.error(err);
  }
};

// .methods must be called on a deedBox object
deedBoxSchema.method.updateRfid = function updateRfid(rfid) {
  this.rfid = rfid
  console.log(this)
}

// .query must be called on a deedBox query object
deedBoxSchema.query.byClientId = function (clientId) {
  try {
    return this
      .where("client")
      .equals(clientId)
      .populate("securities")
      .lean()
  }
  catch (err) {
    logger.error(err);
  }
}

deedBoxSchema.query.byRfid = function (rfid) {
  try {
    return this
      .where("rfid")
      .equals(rfid)
  }
  catch (err) {
    logger.error(err);
  }
}

const DeedBox = mongoose.model("DeedBox", deedBoxSchema);

module.exports = DeedBox;
