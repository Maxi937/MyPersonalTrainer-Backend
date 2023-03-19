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
    placeAddress: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: false,
    },
    reviews: [{
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "Review",
      required: false,
    }],
    serves: [{
      type: Object,
      required: false,
    }],
    description: {
      type: String,
      required: false,
    },
    lat: {
      type: String,
      required: true
    },
    lng: {
      type: String,
      required: true
    }
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

placeSchema.statics.findByLatLng = function(lat, lng) {
  try {
    return this.findOne({lat: lat, lng: lng})
  } catch (err) {
    logger.error(err);
    return None
  }
}

export const Place = Mongoose.model("Place", placeSchema);



