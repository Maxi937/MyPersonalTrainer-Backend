// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import { createlogger } from "../../../config/logger.js";

const logger = createlogger()

const placeSchema = new Mongoose.Schema(
  {
    placeName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    serves: [{
      type: Object,
      required: false,
    }],
    description: {
      type: String,
      required: false,
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    picture: {
      data: Buffer,
      contentType: String,
      required: false
    }
  },
  { timestamps: true }
);

placeSchema.methods.getAvgRating = function () {
  try {
    console.log(this.reviews);
  } catch (err) {
    logger.error(err);
  }
};

placeSchema.methods.addPlace = function () {
  try {
    this.save();
    logger.info("Place added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

placeSchema.statics.findAll = function () {
  try {
    return this.find({}).lean()
  } catch (err) {
    logger.error(err);
    return None
  }
}

placeSchema.statics.byPlaceId = function (placeId) {
  try {
    return this.find({ placeId }).lean()
  } catch (err) {
    logger.error(err);
    return None
  }
}

placeSchema.statics.findByLatLng = function (lat, lng) {
    return this.findOne({ lat: lat, lng: lng })
}

export const Place = Mongoose.model("Place", placeSchema);



