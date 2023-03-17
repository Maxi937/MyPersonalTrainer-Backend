// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import createlogger from "../../../config/logger.js";

const logger = createlogger()

// TODO: Add Validators for inputs

const placeSchema = new Mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    ratings: [{
      type: Number,
      required: false,
    }],
    reviews: [{
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "Review",
      required: false,
    }],
    serves: [{
      type: Object,
      required: false,
    }],
  },
  { timestamps: true }
);

placeSchema.methods.addPlace = function () {
  try {
    this.save();
    logger.info("Place added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

placeSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

placeSchema.statics.byPlaceId = function(placeId) {
  try {
    return this.find({placeId}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

export const Place = Mongoose.model("Place", placeSchema);



